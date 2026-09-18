export interface NewsWhatsappMessageInput {
  title: string;
  excerpt: string;
  typeName: string;
  url: string;
}

const EXCERPT_LENGTH = 160;

/**
 * Arma el texto exacto que se guarda en `message_preview` — una sola vez,
 * en el momento de crear la notificación, siempre con datos reales
 * (título/resumen recién persistidos, nombre real de la clasificación,
 * URL real). Nunca se reconstruye después ni se inventa contenido.
 */
export function buildNewsWhatsappMessage(input: NewsWhatsappMessageInput): string {
  const excerpt =
    input.excerpt.length > EXCERPT_LENGTH ? `${input.excerpt.slice(0, EXCERPT_LENGTH).trimEnd()}…` : input.excerpt;

  return [
    '📢 Nueva noticia de Comercial Jhoel',
    '',
    `📚 ${input.typeName}`,
    '',
    input.title,
    '',
    excerpt,
    '',
    'Lee la noticia aquí:',
    input.url,
    '',
    'Comercial Jhoel',
  ].join('\n');
}
