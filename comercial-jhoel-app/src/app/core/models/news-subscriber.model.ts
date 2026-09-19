export interface NewsSubscriberTypeSummary {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

/**
 * Ficha admin — "Sistema → Suscriptores de Noticias". El número siempre
 * viene enmascarado del backend, y es `null` para un suscriptor solo-push
 * (nunca dio un número de WhatsApp — ver `whatsappNumber: string | null` en
 * el backend, `news-subscriber.entity.ts`).
 */
export interface NewsSubscriber {
  id: string;
  whatsappMasked: string | null;
  name: string | null;
  isActive: boolean;
  consentGiven: boolean;
  consentAt: string | null;
  createdAt: string;
  updatedAt: string;
  types: NewsSubscriberTypeSummary[];
}

export interface NewsSubscriberAuditEntry {
  id: string;
  action: string;
  previousTypeIds: string[] | null;
  newTypeIds: string[] | null;
  performedBy: string | null;
  performedByUsername: string | null;
  createdAt: string;
}

/** Un navegador/dispositivo con notificaciones push registradas para este suscriptor — nunca "1 usuario = 1 dispositivo". */
export interface PushDeviceSummary {
  id: string;
  userAgent: string | null;
  isActive: boolean;
  lastSeenAt: string | null;
  createdAt: string;
}

export interface NewsSubscriberDetail extends NewsSubscriber {
  auditLog: NewsSubscriberAuditEntry[];
  pushDevices: PushDeviceSummary[];
}

/** Shape público — solo para quien ya posee el `manageToken` (autoservicio de preferencias). `whatsappNumber: null` para un suscriptor solo-push. */
export interface Subscription {
  whatsappNumber: string | null;
  name: string | null;
  manageToken: string;
  types: NewsSubscriberTypeSummary[];
}

export interface SubscribeToNewsInput {
  whatsappNumber: string;
  name?: string;
  typeIds: string[];
  consent: boolean;
}
