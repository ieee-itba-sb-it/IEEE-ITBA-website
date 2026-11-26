"""
Genera los certificados del curso de Data Analysis para los alumnos aprobados de una edicion, los sube al storage
(Supabase) bajo data_analysis/certificates y guarda la URL publica en el campo `certificateUrl` del alumno.

Basado en https://github.com/IEEESBITBA/Curso-python/tree/master/Envio_certificados/Curso_Analisis_de_Datos
(misma plantilla y misma forma de dibujar el nombre).

Uso:
    pip install -r scripts/certificates/requirements.txt

    export GOOGLE_APPLICATION_CREDENTIALS="/tmp/key.json"   # o FIRESTORE_EMULATOR_HOST=localhost:8080 para local
    export SUPABASE_KEY="..."                               # anon o service role key del proyecto

    python scripts/certificates/generate_certificates.py 2026-2C
    python scripts/certificates/generate_certificates.py 2026-2C --email alumno@mail.com --force
    python scripts/certificates/generate_certificates.py 2026-2C --dry-run --out /tmp/certificados

Por defecto solo procesa a los aprobados que todavia no tienen certificado, asi que se puede correr varias veces
durante la semana de examenes. --force regenera tambien los que ya tienen (ej: si se corrigio un nombre).
"""

import argparse
import base64
import io
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent
TEMPLATE_PATH = BASE_DIR / "certificate_template.svg"

PROJECT_ID = "ieeeitba"
EVENTS_COLLECTION = "events"
DATA_ANALYSIS_DOCUMENT = "DATA_ANALYSIS"

# Mismos valores que src/app/secrets.ts
DEFAULT_SUPABASE_URL = "https://mqipggrhfgjyfgnzgphy.supabase.co"
DEFAULT_SUPABASE_BUCKET = "IEEE-ITBA-website"
CERTIFICATES_FOLDER = "data_analysis/certificates"

FONT_SIZE = 56
MIN_FONT_SIZE = 32
# Ancho maximo del nombre: los nombres largos achican la fuente para no salirse del recuadro de la plantilla
MAX_NAME_WIDTH = 1200

FONT_CANDIDATES = [
    # Windows (los mismos que el script original)
    "C:/Windows/Fonts/arial.ttf",
    "C:/Windows/Fonts/times.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    # macOS
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    # Linux: Liberation Sans tiene las mismas metricas que Arial
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


class Template:
    """Fondo de la plantilla SVG y posicion (centro) del nombre."""

    def __init__(self, svg: str):
        match = re.search(r'href="data:image/(?P<ext>png|jpeg|jpg);base64,(?P<data>[A-Za-z0-9+/=]+)"', svg)
        if not match:
            raise ValueError("No se encontró una imagen base64 en la plantilla SVG.")
        self.background = Image.open(io.BytesIO(base64.b64decode(match.group("data")))).convert("RGBA")

        text_match = re.search(r'<text id="participant-name"[^>]*x="(?P<x>\d+)"\s+y="(?P<y>\d+)"', svg)
        if not text_match:
            raise ValueError("No se encontró la posición del texto del nombre en la plantilla SVG.")
        self.x = int(text_match.group("x"))
        self.y = int(text_match.group("y"))


def find_font_path(font_arg: str | None) -> str | None:
    if font_arg:
        if not os.path.exists(font_arg):
            sys.exit(f"No existe la fuente {font_arg}")
        return font_arg
    return next((path for path in FONT_CANDIDATES if os.path.exists(path)), None)


def load_font(font_path: str | None, size: int) -> ImageFont.FreeTypeFont:
    if font_path:
        return ImageFont.truetype(font_path, size)
    # Pillow >= 10.1 permite elegir el tamaño de la fuente por defecto
    return ImageFont.load_default(size=size)


def render_certificate(template: Template, name: str, font_path: str | None) -> bytes:
    canvas = Image.new("RGBA", template.background.size, (255, 255, 255, 0))
    canvas.paste(template.background, (0, 0))
    draw = ImageDraw.Draw(canvas)

    size = FONT_SIZE
    font = load_font(font_path, size)
    while size > MIN_FONT_SIZE and draw.textlength(name, font=font) > MAX_NAME_WIDTH:
        size -= 2
        font = load_font(font_path, size)

    text_bbox = draw.textbbox((0, 0), name, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    draw.text((template.x - text_width / 2, template.y - text_height / 2), name, fill=(0, 0, 0, 255), font=font)

    output = io.BytesIO()
    canvas.convert("RGB").save(output, format="PNG", optimize=True)
    return output.getvalue()


class SupabaseStorage:
    def __init__(self, url: str, bucket: str, key: str):
        self.url = url.rstrip("/")
        self.bucket = bucket
        self.key = key

    def _object_path(self, path: str) -> str:
        return f"{urllib.parse.quote(self.bucket)}/{urllib.parse.quote(path)}"

    def public_url(self, path: str) -> str:
        return f"{self.url}/storage/v1/object/public/{self._object_path(path)}"

    def path_from_public_url(self, public_url: str) -> str | None:
        prefix = f"{self.url}/storage/v1/object/public/{urllib.parse.quote(self.bucket)}/"
        if not public_url.startswith(prefix):
            return None
        return urllib.parse.unquote(public_url[len(prefix):].split("?")[0])

    def upload(self, path: str, data: bytes, content_type: str) -> None:
        request = urllib.request.Request(
            f"{self.url}/storage/v1/object/{self._object_path(path)}",
            data=data,
            method="POST",
            headers={
                "Authorization": f"Bearer {self.key}",
                "apikey": self.key,
                "Content-Type": content_type,
                "x-upsert": "true",
            },
        )
        try:
            with urllib.request.urlopen(request) as response:
                response.read()
        except urllib.error.HTTPError as error:
            raise RuntimeError(f"Supabase respondió {error.code}: {error.read().decode(errors='replace')}") from error


def certificate_path(edition: str, storage: SupabaseStorage, current_url: str | None) -> str:
    # El nombre es aleatorio para que no se puedan adivinar los certificados de otros alumnos a partir de su mail.
    # Al regenerar se reusa el mismo archivo
    existing = storage.path_from_public_url(current_url) if current_url else None
    if existing and existing.startswith(f"{CERTIFICATES_FOLDER}/"):
        return existing
    return f"{CERTIFICATES_FOLDER}/{edition}/{uuid.uuid4().hex}.png"


def main() -> None:
    parser = argparse.ArgumentParser(description="Genera y sube los certificados de los alumnos aprobados.")
    parser.add_argument("edition", help="Edición del curso, ej: 2026-2C")
    parser.add_argument("--email", action="append", help="Solo este alumno (se puede repetir)")
    parser.add_argument("--force", action="store_true", help="Regenera también los que ya tienen certificado")
    parser.add_argument("--dry-run", action="store_true", help="No sube nada ni escribe en Firestore")
    parser.add_argument("--out", type=Path, help="Carpeta donde guardar también una copia local de cada PNG")
    parser.add_argument("--font", help="Ruta a un .ttf para el nombre (por defecto Arial o equivalente)")
    args = parser.parse_args()

    if not re.fullmatch(r"\d{4}-[12]C", args.edition):
        sys.exit(f"Edición inválida: {args.edition} (formato esperado: YYYY-1C o YYYY-2C)")

    supabase_key = os.environ.get("SUPABASE_KEY")
    if not supabase_key and not args.dry_run:
        sys.exit("Falta la variable de entorno SUPABASE_KEY")
    storage = SupabaseStorage(
        os.environ.get("SUPABASE_URL", DEFAULT_SUPABASE_URL),
        os.environ.get("SUPABASE_BUCKET", DEFAULT_SUPABASE_BUCKET),
        supabase_key or "",
    )

    font_path = find_font_path(args.font)
    if not font_path:
        print("Aviso: no se encontró Arial ni equivalente, se usa la fuente por defecto de Pillow (--font para elegir otra)")

    template = Template(TEMPLATE_PATH.read_text(encoding="utf-8"))
    if args.out:
        args.out.mkdir(parents=True, exist_ok=True)

    # Con FIRESTORE_EMULATOR_HOST usa el emulador sin credenciales; si no, GOOGLE_APPLICATION_CREDENTIALS
    db = firestore.Client(project=PROJECT_ID)
    students_ref = (db.collection(EVENTS_COLLECTION).document(DATA_ANALYSIS_DOCUMENT)
                    .collection("editions").document(args.edition).collection("students"))
    passed = students_ref.where(filter=FieldFilter("passedCourse", "==", True)).stream()

    emails = {email.lower() for email in args.email} if args.email else None
    generated, skipped, failed = 0, 0, 0
    for snapshot in passed:
        student = snapshot.to_dict()
        email = student.get("email", snapshot.id)
        if emails is not None and email.lower() not in emails:
            continue
        if student.get("certificateUrl") and not args.force:
            skipped += 1
            continue

        name = f"{student.get('firstName', '').strip()} {student.get('lastName', '').strip()}".strip()
        if not name:
            print(f"  ✗ {email}: no tiene nombre cargado")
            failed += 1
            continue

        try:
            png = render_certificate(template, name, font_path)
            if args.out:
                (args.out / f"{name} - {email}.png").write_bytes(png)

            path = certificate_path(args.edition, storage, student.get("certificateUrl"))
            if not args.dry_run:
                storage.upload(path, png, "image/png")
                # El parametro de version evita que el navegador o la CDN sirvan una version anterior al regenerar
                snapshot.reference.update({"certificateUrl": f"{storage.public_url(path)}?v={int(time.time())}"})
            print(f"  ✓ {email}: {name}")
            generated += 1
        except Exception as error:  # sigue con el resto de los alumnos
            print(f"  ✗ {email}: {error}")
            failed += 1

    if emails is not None and generated + skipped + failed < len(emails):
        print("Aviso: algún mail de --email no es un alumno aprobado de esta edición")
    mode = " (dry run: no se subió nada)" if args.dry_run else ""
    print(f"\nGenerados: {generated}, ya tenían certificado: {skipped}, con error: {failed}{mode}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
