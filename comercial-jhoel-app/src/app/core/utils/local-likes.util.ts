/**
 * Recuerda, por navegador (no hay cuentas de visitante en la landing
 * pública), qué elementos ya recibieron "me gusta" desde este dispositivo
 * — lo único que permite alternar el botón (like/unlike) en vez de dejarlo
 * como un contador que solo sube. El conteo real siempre vive en el
 * backend; esto es puramente una conveniencia de UI del lado del cliente.
 * Envuelto en try/catch: un visitante con `localStorage` bloqueado (modo
 * privado estricto, política de cookies) simplemente no recuerda su
 * "like" entre recargas — el botón sigue funcionando, solo no persiste.
 */
const STORAGE_PREFIX = 'cj_liked';

export type LikeKind = 'phone' | 'product' | 'news';

function storageKey(kind: LikeKind, id: string): string {
  return `${STORAGE_PREFIX}:${kind}:${id}`;
}

export function hasLiked(kind: LikeKind, id: string): boolean {
  try {
    return localStorage.getItem(storageKey(kind, id)) === '1';
  } catch {
    return false;
  }
}

export function setLiked(kind: LikeKind, id: string, liked: boolean): void {
  try {
    if (liked) {
      localStorage.setItem(storageKey(kind, id), '1');
    } else {
      localStorage.removeItem(storageKey(kind, id));
    }
  } catch {
    // Sin persistencia disponible — el botón sigue funcionando en memoria durante esta sesión.
  }
}
