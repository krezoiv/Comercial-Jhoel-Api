/**
 * Un cliente suscrito a recibir noticias — dato enviado públicamente, sin
 * cuenta/sesión (sin `createdBy`/`updatedBy`, mismo criterio que
 * `CatalogRequest`). `manageToken` es el mecanismo de autoservicio para
 * cancelar/editar preferencias sin usar el número como autenticación. Las
 * categorías suscritas viven en `news_subscriber_types` (relación
 * normalizada, nunca texto separado por comas) — nunca en estas props.
 *
 * `whatsappNumber` es opcional: un suscriptor puede haberse dado de alta
 * solo por WhatsApp, solo por notificaciones push del navegador
 * (`news_push_subscriptions`), o por ambos — la misma fila y el mismo
 * `manageToken` cubren cualquiera de los dos canales, nunca un suscriptor
 * paralelo por canal.
 *
 * Sin una clase de dominio propia con getters: el repositorio siempre
 * devuelve `NewsSubscriberListItem` (estas props + `types`), nunca esta
 * forma sola — no hay un caso de uso real en este módulo que necesite el
 * suscriptor sin sus categorías.
 */
export interface NewsSubscriberProps {
  id: string;
  whatsappNumber: string | null;
  name: string | null;
  isActive: boolean;
  consentGiven: boolean;
  consentAt: Date | null;
  manageToken: string;
  createdAt: Date;
  updatedAt: Date;
}
