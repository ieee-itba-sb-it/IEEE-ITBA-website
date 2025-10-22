import requests
from bs4 import BeautifulSoup
from firebase_functions import scheduler_fn

from utils.firestore_client import db  # ✅ usamos tu cliente ya inicializado

@scheduler_fn.on_schedule(schedule="every 1 hours")
def scraping_ieeextreme():
    url = "https://ieeextreme.org/ieeextreme-18-0-ranking/"

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    table = soup.find("table", {"id": "tablepress-28"})

    if not table:
        print("❌ No se encontró la tabla del ranking.")
        exit()

    rows = table.find("tbody").find_all("tr")

    collection_ref = db.collection("ieeextreme-teams")
    added_count = 0

    for row in rows:
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        if len(cols) == 8:
            team_name, university, country, region, global_rank, region_rank, country_rank, university_rank = cols

            # Filtrar equipos argentinos
            if country.lower() == "argentina":
                data = {
                    "team_name": team_name,
                    "university": university,
                    "country": country,
                    "region": region,
                    "global_rank": int(global_rank),
                    "region_rank": int(region_rank),
                    "country_rank": int(country_rank),
                    "university_rank": int(university_rank),
                }

                # Crear o actualizar documento (ID = nombre del equipo)
                collection_ref.document(team_name).set(data)
                added_count += 1
                print(f"✅ Guardado en Firestore: {team_name}")

    print(f"\n🏁 Total de equipos argentinos guardados: {added_count}")
