import {
  CatalogProductRequest,
  CatalogProductRequestStatus,
} from '../entities/catalog-product-request.entity';

export const CATALOG_PRODUCT_REQUEST_REPOSITORY = Symbol(
  'CATALOG_PRODUCT_REQUEST_REPOSITORY',
);

export interface CreateCatalogProductRequestData {
  catalogProductId: string;
  productName: string;
  price: number;
  customerName: string;
  customerPhone: string;
}

export interface ListCatalogProductRequestsOptions {
  status?: CatalogProductRequestStatus;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCatalogProductRequestStatusData {
  status: CatalogProductRequestStatus;
  observation?: string | null;
  updatedBy: string;
}

export interface CatalogProductRequestRepository {
  findAll(
    options?: ListCatalogProductRequestsOptions,
  ): Promise<CatalogProductRequest[]>;
  findById(id: string): Promise<CatalogProductRequest | null>;
  create(data: CreateCatalogProductRequestData): Promise<CatalogProductRequest>;
  updateStatus(
    id: string,
    data: UpdateCatalogProductRequestStatusData,
  ): Promise<CatalogProductRequest>;
}
