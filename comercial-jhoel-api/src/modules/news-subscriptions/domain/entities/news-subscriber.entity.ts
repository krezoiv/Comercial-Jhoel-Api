/**
 * Un cliente que registró su WhatsApp para recibir noticias — dato enviado
 * públicamente, sin cuenta/sesión (sin `createdBy`/`updatedBy`, mismo
 * criterio que `CatalogRequest`). `manageToken` es el mecanismo de
 * autoservicio para cancelar/editar preferencias sin usar el número como
 * autenticación. Las categorías suscritas viven en `news_subscriber_types`
 * (relación normalizada, nunca texto separado por comas) — nunca en estas
 * props.
 *
 * Sin una clase de dominio propia con getters: el repositorio siempre
 * devuelve `NewsSubscriberListItem` (estas props + `types`), nunca esta
 * forma sola — no hay un caso de uso real en este módulo que necesite el
 * suscriptor sin sus categorías.
 */
export interface NewsSubscriberProps {
  id: string;
  whatsappNumber: string;
  name: string | null;
  isActive: boolean;
  consentGiven: boolean;
  consentAt: Date | null;
  manageToken: string;
  createdAt: Date;
  updatedAt: Date;
}
