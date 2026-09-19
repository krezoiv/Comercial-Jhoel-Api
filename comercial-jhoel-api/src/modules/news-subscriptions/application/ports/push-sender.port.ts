export const PUSH_SENDER = Symbol('PUSH_SENDER');

export interface PushSubscriptionTarget {
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Payload exacto que espera el Service Worker de Angular (`SwPush`) — ver
 * `buildNewsPushPayload`. `onActionClickUrl` alimenta
 * `data.onActionClick.default` (`operation: 'focusLastFocusedOrOpen'`),
 * el mecanismo NATIVO de Angular para enfocar una pestaña ya abierta en
 * vez de abrir una nueva — nunca código propio de click-handling.
 */
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  onActionClickUrl: string;
}

export type PushSendOutcome =
  | { result: 'sent' }
  | { result: 'expired'; errorMessage: string }
  | { result: 'failed'; errorMessage: string };

/**
 * Puerto de envío de Web Push — nunca lanza (mismo contrato que el extinto
 * `WhatsAppSender`): cualquier resultado, incluido un endpoint muerto
 * (410/404 del navegador/proveedor push), vuelve como un `PushSendOutcome`
 * normal para que el llamador decida qué columna de `news_push_deliveries`
 * actualizar — nunca una excepción sin capturar.
 */
export interface PushSender {
  send(target: PushSubscriptionTarget, payload: PushNotificationPayload): Promise<PushSendOutcome>;
}
