import {getFirestore, FieldValue} from 'firebase-admin/firestore';

// Colección de noticias (usar la real en producción si difiere)
const BLOG_COLLECTION = 'blog-entries';

function includesImageUrl(html: string, url: string): boolean {
    if (!html || !url) return false;
    // Coincidencia laxa: busca el src con o sin comillas y parámetros
    return new RegExp(`<img[^>]*src=["']?${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^"'>]*)["']?`, 'i').test(html);
}

function maybeWrapParagraph(text?: string): string {
    const t = (text || '').trim();
    if (!t) return '';
    // Si ya parece HTML, no envolver (heurística simple)
    if (t.startsWith('<')) return t;
    return `<p>${t}</p>`;
}

function buildCenteredImageHtml(src: string, alt: string): string {
    const altEsc = alt ? alt.replace(/"/g, '&quot;') : 'Imagen';
    // Altura fija 500px, responsivo en ancho
    return `<p class="ql-align-center"><img src="${src}" alt="${altEsc}" style="height:500px;max-width:100%;width:auto;"/></p>`;
}

function buildCaptionHtml(caption?: string): string {
    const t = (caption || '').trim();
    if (!t) return '';
    return `<p class="ql-align-center">${t}</p>`;
}

export async function migrateNewsToNewFormat() {
    const db = getFirestore();
    const col = db.collection(BLOG_COLLECTION);
    const snap = await col.get();

    let processed = 0;
    for (const doc of snap.docs) {
        const data: any = doc.data();

        const imageUrl: string = data.imageUrl || '';
        const shortIntro: string = data.shortIntro || '';
        const imageText: string = data.imageText || '';
        const content: string = data.content || '';
        const title: string = data.title || '';

        // Detectar si ya está migrado: no hay shortIntro ni imageText y el contenido ya tiene la imagen
        const alreadyMigrated = !shortIntro && !imageText && (imageUrl ? includesImageUrl(content, imageUrl) : true);
        if (alreadyMigrated) continue;

        // Partes a componer
        const parts: string[] = [];

        // shortIntro al inicio si no está contenido ya (heurística: por substring)
        const shortIntroHtml = maybeWrapParagraph(shortIntro);
        if (shortIntroHtml && !content.includes(shortIntro.trim())) {
            parts.push(shortIntroHtml);
        }

        // Imagen centrada (solo si no está ya incluida en el contenido)
        if (imageUrl && !includesImageUrl(content, imageUrl)) {
            parts.push(buildCenteredImageHtml(imageUrl, title || 'Imagen'));
            // Epígrafe debajo, centrado
            const captionHtml = buildCaptionHtml(imageText);
            if (captionHtml) parts.push(captionHtml);
        } else {
            // Si la imagen ya estaba en el contenido, agregar solo el epígrafe si no parece existir
            const captionHtml = buildCaptionHtml(imageText);
            if (captionHtml && !content.includes(imageText)) parts.push(captionHtml);
        }

        // Agregar el contenido existente al final
        if (content) parts.push(content);

        const mergedContent = parts.filter(Boolean).join('\n\n');

        // Preparar update: set content y eliminar campos viejos
        const updatePayload: any = {
            content: mergedContent,
        };
        if ('shortIntro' in data) updatePayload.shortIntro = FieldValue.delete();
        if ('imageText' in data) updatePayload.imageText = FieldValue.delete();

        await doc.ref.update(updatePayload);
        processed++;
    }

    console.log(`Migración completada. Documentos actualizados: ${processed}`);
}

