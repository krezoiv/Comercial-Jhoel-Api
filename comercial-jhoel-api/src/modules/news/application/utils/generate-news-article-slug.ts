const COMBINING_DIACRITICAL_MARKS = new RegExp('[̀-ͯ]', 'g');

/** Copia local del slugify de `modules/news-types` — mismo criterio de "pequeña copia por módulo" ya establecido en este proyecto. */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_DIACRITICAL_MARKS, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Genera un slug único a partir del título — solo se llama una vez, al
 * crear la noticia (nunca al editar: el slug es estable de por vida una
 * vez publicado, punto 18 del pedido). `slugExists` consulta la BD para
 * evitar colisiones, agregando `-2`/`-3`... según haga falta.
 */
export async function generateNewsArticleSlug(
  title: string,
  slugExists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(title) || 'noticia';
  let candidate = base;
  let suffix = 2;
  while (await slugExists(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}
