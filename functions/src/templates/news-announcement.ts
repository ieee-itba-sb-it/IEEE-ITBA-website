export interface NewsEmailData {
  title: string;
  content: string;
  imageUrl?: string;
  reference: string;
  author?: string;
}

/**
 * Helper to strip HTML tags from rich text content and generate a short excerpt.
 */
export function createExcerpt(htmlContent: string, maxLength: number = 220): string {
  if (!htmlContent) return "";
  // Strip HTML tags using regex
  const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Generates responsive HTML email body for published news announcements.
 */
export function generateNewsAnnouncementHtml(news: NewsEmailData): string {
  const articleUrl = `https://ieeeitba.org.ar/noticias/${news.reference}`;
  const excerpt = createExcerpt(news.content);
  const imageHtml = news.imageUrl
    ? `<div style="text-align: center; margin-bottom: 24px;">
        <img src="${news.imageUrl}" alt="${news.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
       </div>`
    : "";

  const authorHtml = news.author
    ? `<p style="margin: 0 0 16px 0; font-size: 14px; color: #666666;">Por <strong>${news.author}</strong></p>`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${news.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #333333;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #00629B; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">IEEE Student Branch ITBA</h1>
              <p style="color: #d0e6f7; margin: 4px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Boletín de Noticias</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #00629B; margin: 0 0 16px 0; font-size: 22px; font-weight: 700; line-height: 1.3;">
                ${news.title}
              </h2>
              ${authorHtml}
              ${imageHtml}
              <p style="font-size: 16px; line-height: 1.6; color: #444444; margin-bottom: 24px;">
                ${excerpt}
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${articleUrl}" target="_blank" style="background-color: #00629B; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px; display: inline-block; box-shadow: 0 2px 8px rgba(0,98,155,0.3);">
                  Leer Noticia Completa
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 32px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #777777;">
                Recibes este correo porque estás suscrito a las novedades de <strong>IEEE ITBA</strong>.
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                Para cambiar tus preferencias de suscripción, ingresa a tu <a href="https://ieeeitba.org.ar/profile" style="color: #00629B; text-decoration: underline;">perfil de usuario</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
