export const NEWS_NOTIFICATION_REPOSITORY = Symbol('NEWS_NOTIFICATION_REPOSITORY');

export interface CreateNewsNotificationsForArticleData {
  newsArticleId: string;
  newsTypeId: string;
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
}
