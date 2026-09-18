/**
 * Identificador anónimo y opaco de este navegador — sin datos personales,
 * sin cuenta, sin cookie — usado únicamente como clave de correlación para
 * que el backend pueda evitar likes duplicados por visitante. Reemplaza a
 * `local-likes.util.ts`: aquí NO se guarda si algo tiene like ni el
 * contador — eso siempre se pregunta al backend (fuente de verdad real en
 * PostgreSQL). Solo se persiste este UUID, generado una sola vez.
 * Envuelto en try/catch: un visitante con `localStorage` bloqueado (modo
 * privado estricto) simplemente recibe un id nuevo en cada visita — el
 * like sigue funcionando, solo no se recuerda entre recargas.
 */
const STORAGE_KEY = 'cj_visitor_id';

let cachedVisitorId: string | null = null;

export function getVisitorId(): string {
  if (cachedVisitorId) {
    return cachedVisitorId;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      cachedVisitorId = stored;
      return stored;
    }
    const generated = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, generated);
    cachedVisitorId = generated;
    return generated;
  } catch {
    cachedVisitorId = crypto.randomUUID();
    return cachedVisitorId;
  }
}
