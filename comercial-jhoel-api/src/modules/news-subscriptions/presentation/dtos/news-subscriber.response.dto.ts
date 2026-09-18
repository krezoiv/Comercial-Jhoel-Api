export class NewsSubscriberTypeSummaryDto {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

/** Shape admin — número siempre enmascarado (punto 30 del pedido). */
export class NewsSubscriberResponseDto {
  id: string;
  whatsappMasked: string;
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

export class NewsSubscriberDetailResponseDto extends NewsSubscriberResponseDto {
  auditLog: NewsSubscriberAuditEntryResponseDto[];
}

/** Shape público — solo para quien ya posee el `manageToken` secreto. */
export class SubscriptionResponseDto {
  whatsappNumber: string;
  name: string | null;
  manageToken: string;
  types: NewsSubscriberTypeSummaryDto[];
}
