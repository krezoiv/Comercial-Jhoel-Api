export class NewsSubscriberTypeSummaryDto {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

/** Shape admin — número siempre enmascarado (punto 30 del pedido). `null` = suscriptor solo-push, sin WhatsApp. */
export class NewsSubscriberResponseDto {
  id: string;
  whatsappMasked: string | null;
  name: string | null;
  isActive: boolean;
  consentGiven: boolean;
  consentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  types: NewsSubscriberTypeSummaryDto[];
}

export class NewsSubscriberAuditEntryResponseDto {
  id: string;
  action: string;
  previousTypeIds: string[] | null;
  newTypeIds: string[] | null;
  performedBy: string | null;
  performedByUsername: string | null;
  createdAt: Date;
}

export class PushSubscriptionSummaryResponseDto {
  id: string;
  userAgent: string | null;
  isActive: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
}

export class NewsSubscriberDetailResponseDto extends NewsSubscriberResponseDto {
  auditLog: NewsSubscriberAuditEntryResponseDto[];
  pushDevices: PushSubscriptionSummaryResponseDto[];
}

/** Shape público — solo para quien ya posee el `manageToken` secreto. `whatsappNumber: null` si nunca proporcionó WhatsApp (suscriptor solo-push). */
export class SubscriptionResponseDto {
  whatsappNumber: string | null;
  name: string | null;
  manageToken: string;
  types: NewsSubscriberTypeSummaryDto[];
}
