import {
  CatalogRequest,
  CatalogRequestStatus,
  CatalogRequestType,
} from '../entities/catalog-request.entity';

export const CATALOG_REQUEST_REPOSITORY = Symbol('CATALOG_REQUEST_REPOSITORY');

export interface CreateCatalogRequestData {
  catalogPhoneId: string;
  brand: string;
  model: string;
  price: number;
  creditAvailable: boolean;
  requestType: CatalogRequestType;
  customerName: string;
  customerPhone: string;
}

export interface ListCatalogRequestsOptions {
  status?: CatalogRequestStatus;
  requestType?: CatalogRequestType;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCatalogRequestStatusData {
  status: CatalogRequestStatus;
  observation?: string | null;
  updatedBy: string;
}

export interface CatalogRequestRepository {
  findAll(options?: ListCatalogRequestsOptions): Promise<CatalogRequest[]>;
  findById(id: string): Promise<CatalogRequest | null>;
  create(data: CreateCatalogRequestData): Promise<CatalogRequest>;
  updateStatus(
    id: string,
    data: UpdateCatalogRequestStatusData,
  ): Promise<CatalogRequest>;
  /** Feeds the `CATALOG_REQUEST_NEW` alert (see `modules/alerts`) — count of currently `NUEVA` leads. */
  countByStatus(status: CatalogRequestStatus): Promise<number>;
}
