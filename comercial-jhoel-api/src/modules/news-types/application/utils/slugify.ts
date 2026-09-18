const COMBINING_DIACRITICAL_MARKS = new RegExp('[̀-ͯ]', 'g');

/**
 * Convierte un texto libre en un slug URL-safe: minúsculas, sin acentos,
 * espacios/símbolos colapsados a un solo `-`, sin `-` al inicio/final.
 * `normalize('NFD')` + strip del rango Unicode de marcas combinantes
 * (U+0300–U+036F) es un truco estándar de solo JS, sin dependencia nueva,
 * para quitar tildes en español.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_DIACRITICAL_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
