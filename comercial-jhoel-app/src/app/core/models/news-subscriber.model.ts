export interface NewsSubscriberTypeSummary {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

/** Ficha admin — "Sistema → Suscriptores de Noticias". El número siempre viene enmascarado del backend. */
export interface NewsSubscriber {
  id: string;
  whatsappMasked: string;
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

export interface NewsSubscriberDetail extends NewsSubscriber {
  auditLog: NewsSubscriberAuditEntry[];
}

/** Shape público — solo para quien ya posee el `manageToken` (autoservicio de preferencias). */
export interface Subscription {
  whatsappNumber: string;
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
