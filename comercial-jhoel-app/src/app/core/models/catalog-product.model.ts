export type CatalogProductSection = 'LIBRERIA' | 'VARIEDADES_ACCESORIOS';

/** Ficha completa de administración — nombre/precio/categoría/negocio se leen en vivo de Inventario, nunca se editan aquí. */
export interface CatalogProduct {
  id: string;
  productId: string;
  section: CatalogProductSection;
  catalogDescription: string | null;
  hasImage: boolean;
  isActive: boolean;
  sortOrder: number;
  likesCount: number;
  productName: string;
  productPrice: number;
  productIsActive: boolean;
  categoryName: string;
  businessName: string;
  unitOfMeasureAbbreviation: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface CreateCatalogProductInput {
  productId: string;
  section: CatalogProductSection;
  catalogDescription?: string | null;
}

export interface UpdateCatalogProductInput {
  catalogDescription?: string | null;
}

/** Shape público — backs Librería/Variedades en la landing. Sin costo/stock/proveedor/estado administrativo. */
export interface PublicCatalogProduct {
  id: string;
  section: CatalogProductSection;
  name: string;
  price: number;
  categoryName: string;
  description: string | null;
  hasImage: boolean;
  likesCount: number;
  /** Si este visitante (identificado por `getVisitorId()`) ya le dio like — viene siempre del backend, nunca de `localStorage`. */
  liked: boolean;
  unitOfMeasureAbbreviation: string | null;
}

export type CatalogProductRequestStatus =
  | 'NUEVA'
  | 'CONTACTADA'
  | 'EN_PROCESO'
  | 'ATENDIDA'
  | 'CANCELADA';

/** "Lo quiero" de Variedades y Accesorios — snapshot congelado, deliberadamente sin nada de Krediya/crédito. */
export interface CatalogProductRequest {
  id: string;
  catalogProductId: string;
  productName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: CatalogProductRequestStatus;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface CreateCatalogProductRequestPayload {
  catalogProductId: string;
  customerName: string;
  customerPhone: string;
}

export interface UpdateCatalogProductRequestStatusInput {
  status: CatalogProductRequestStatus;
  observation?: string | null;
}

export interface ListCatalogProductRequestsFilters {
  status?: CatalogProductRequestStatus;
  startDate?: string;
  endDate?: string;
}

export const CATALOG_PRODUCT_REQUEST_STATUS_LABEL: Record<CatalogProductRequestStatus, string> = {
  NUEVA: 'Nueva',
  CONTACTADA: 'Contactada',
  EN_PROCESO: 'En proceso',
  ATENDIDA: 'Atendida',
  CANCELADA: 'Cancelada',
};

export const CATALOG_PRODUCT_REQUEST_STATUS_TONE: Record<
  CatalogProductRequestStatus,
  'brand' | 'gold' | 'success' | 'danger' | 'neutral-dark'
> = {
  NUEVA: 'gold',
  CONTACTADA: 'brand',
  EN_PROCESO: 'brand',
  ATENDIDA: 'success',
  CANCELADA: 'danger',
};
