export const NEWS_NOTIFICATION_REPOSITORY = Symbol('NEWS_NOTIFICATION_REPOSITORY');

export interface CreateNewsNotificationsForArticleData {
  newsArticleId: string;
  newsTypeId: string;
  messagePreview: string;
}

export interface PendingNewsNotification {
  id: string;
  whatsappNumber: string;
  messagePreview: string;
}

export interface NewsNotificationRepository {
  /**
   * La ÚNICA fuente de verdad de "quién debe recibir esta noticia" — un
   * solo `INSERT ... SELECT ... ON CONFLICT DO NOTHING`, nunca reimplementado
   * en otro lugar. La regla central ("Comercial"/wildcard recibe todo,
   * cualquier otro tipo recibe solo el suyo) vive exclusivamente aquí, en
   * la implementación TypeORM — nunca duplicada en el frontend ni en un
   * Stored Procedure paralelo. Devuelve cuántas notificaciones nuevas se
   * crearon (0 en una publicación sin suscriptores compatibles).
   */
  createForArticle(data: CreateNewsNotificationsForArticleData): Promise<{ created: number }>;

  /**
   * Filas en `PENDING` listas para intentar el envío, ya con el
   * `whatsapp_number` real del suscriptor resuelto (join contra
   * `news_subscribers`) — nunca un suscriptor desactivado desde que se
   * creó la notificación. `articleId` acota a una sola noticia (el caso
   * normal, justo después de crearla); omitirlo procesa cualquier
   * pendiente de cualquier noticia (para un reintento manual futuro).
   */
  findPendingWithRecipient(articleId?: string): Promise<PendingNewsNotification[]>;

  /** Marca una notificación como enviada — incrementa `attempts`, guarda el `external_id` (wamid) del proveedor y `sent_at`. */
  markSent(id: string, externalId: string | undefined): Promise<void>;

  /** Marca una notificación como fallida — incrementa `attempts` y guarda el motivo. La fila se queda en `FAILED`, nunca se borra (permite reintentar/auditar). */
  markFailed(id: string, errorMessage: string): Promise<void>;
}
