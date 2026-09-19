/**
 * Estados reales que `PushNotificationService` puede distinguir — no los 6
 * nombrados en el pedido original tal cual, por una limitación genuina de la
 * plataforma: la API `Notification.permission` del navegador solo expone
 * `'default' | 'granted' | 'denied'`, y NUNCA distingue "el usuario lo negó
 * una vez" de "el navegador lo bloqueó permanentemente" — ambos casos llegan
 * como `'denied'`. Prometer esa distinción sería mentirle al usuario sobre
 * una capacidad que el navegador no ofrece.
 *
 * - `unsupported`   → sin Service Worker / PushManager / Notification API.
 * - `ios-needs-install` → iOS/iPadOS Safari en pestaña normal (no instalado
 *   como PWA) — Safari solo ofrece el permiso de Push a un sitio ya agregado
 *   a la pantalla de inicio (`display-mode: standalone`), nunca en pestaña.
 *   NO aplica a macOS: desde Safari 16.1/macOS Ventura, Mac Safari sí
 *   permite pedir el permiso de Push desde una pestaña normal, sin requerir
 *   "Agregar al Dock" — confirmado explícitamente, no asumido (ver el doc
 *   comment de `isIosNeedingInstall` en el servicio).
 * - `sw-pending`    → todo lo demás es compatible, pero el Service Worker
 *   real (`navigator.serviceWorker.ready`) aún no terminó de activarse —
 *   estado transitorio, nunca se debe permitir suscribirse mientras dura.
 * - `not-requested` → compatible, Service Worker activo, nunca se pidió permiso.
 * - `pending`       → esperando la respuesta del prompt nativo del navegador.
 * - `granted`       → `Notification.permission === 'granted'`.
 * - `denied`        → `Notification.permission === 'denied'` (negado o
 *   bloqueado — indistinguibles desde JS).
 */
export type PushPermissionState =
  | 'unsupported'
  | 'ios-needs-install'
  | 'sw-pending'
  | 'not-requested'
  | 'pending'
  | 'granted'
  | 'denied';

export interface RegisterPushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  typeIds: string[];
  existingManageToken?: string;
}
