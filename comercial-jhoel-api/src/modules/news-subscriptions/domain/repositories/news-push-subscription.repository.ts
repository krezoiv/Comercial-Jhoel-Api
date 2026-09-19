export const NEWS_PUSH_SUBSCRIPTION_REPOSITORY = Symbol('NEWS_PUSH_SUBSCRIPTION_REPOSITORY');

export interface UpsertPushSubscriptionData {
  subscriberId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string | null;
}

export interface PushSubscriptionSummary {
  id: string;
  userAgent: string | null;
  isActive: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
}

/** Un dispositivo/navegador con sus datos ya resueltos para intentar el envío — nunca solo el id, el llamador (el sender) siempre necesita endpoint/p256dh/auth juntos. */
export interface EligiblePushSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface NewsPushSubscriptionRepository {
  /**
   * `endpoint` es la clave natural de deduplicación (ver doc comment de la
   * migración) — reintentar la suscripción desde el mismo navegador
   * siempre reescribe la MISMA fila (reactivándola si estaba inactiva),
   * nunca crea una segunda.
   */
  upsertByEndpoint(data: UpsertPushSubscriptionData): Promise<void>;
  /** Soft — nunca borra la fila, solo `is_active = false` (permite reactivarla si el mismo endpoint vuelve a suscribirse). */
  deactivateByEndpoint(endpoint: string): Promise<void>;
  /** Dispositivos (activos e inactivos) de un suscriptor — para el detalle admin. */
  findBySubscriber(subscriberId: string): Promise<PushSubscriptionSummary[]>;
  /**
   * Único punto que decide "qué dispositivos deben recibir esta noticia"
   * — mismo criterio wildcard/categoría que ya usaba `news_notifications`,
   * ahora resuelto por dispositivo en vez de por suscriptor (un
   * suscriptor con 3 dispositivos activos produce 3 filas aquí).
   */
  findEligibleForArticle(newsTypeId: string): Promise<EligiblePushSubscription[]>;
  /** `INSERT ... ON CONFLICT DO NOTHING` — mismo mecanismo anti-duplicado que ya usaba `news_notifications`. Devuelve `false` si ya existía (no se debe reintentar el envío). */
  createDelivery(newsArticleId: string, pushSubscriptionId: string): Promise<boolean>;
  markDeliverySent(newsArticleId: string, pushSubscriptionId: string): Promise<void>;
  markDeliveryFailed(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void>;
  markDeliveryExpired(newsArticleId: string, pushSubscriptionId: string, errorMessage: string): Promise<void>;
}
