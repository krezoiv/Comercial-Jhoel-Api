export type CatalogRequestType = 'INTERES_COMPRA' | 'INTERES_CREDITO';

export type CatalogRequestStatus = 'NUEVA' | 'CONTACTADA' | 'EN_PROCESO' | 'ATENDIDA' | 'CANCELADA';

/** Solicitud de interés (compra o crédito Krediya) — snapshot congelado al momento de crearse, nunca releído del teléfono. */
export interface CatalogRequest {
  id: string;
  catalogPhoneId: string | null;
  brand: string;
  model: string;
  price: number;
  creditAvailable: boolean;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
  status: CatalogRequestStatus;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface UpdateCatalogRequestStatusInput {
  status: CatalogRequestStatus;
  observation?: string | null;
}

export interface ListCatalogRequestsFilters {
  status?: CatalogRequestStatus;
  requestType?: CatalogRequestType;
  startDate?: string;
  endDate?: string;
}

/** Payload público — solo lo mínimo para registrar interés, nunca precio/creditAvailable (el backend los recalcula siempre). */
export interface CreateCatalogRequestPayload {
  catalogPhoneId: string;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
}

export const CATALOG_REQUEST_STATUS_LABEL: Record<CatalogRequestStatus, string> = {
  NUEVA: 'Nueva',
  CONTACTADA: 'Contactada',
  EN_PROCESO: 'En proceso',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
};

export const CATALOG_REQUEST_STATUS_TONE: Record<CatalogRequestStatus, 'brand' | 'gold' | 'success' | 'danger' | 'neutral-dark'> = {
  NUEVA: 'gold',
  CONTACTADA: 'brand',
  EN_PROCESO: 'brand',
  ATENDIDA: 'success',
  CANCELADA: 'danger',
};

export const CATALOG_REQUEST_TYPE_LABEL: Record<CatalogRequestType, string> = {
  INTERES_COMPRA: 'Compra',
  INTERES_CREDITO: 'Crédito Krediya',
};
