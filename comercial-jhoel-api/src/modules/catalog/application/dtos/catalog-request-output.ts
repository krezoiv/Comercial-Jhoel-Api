import { CatalogRequest } from '../../domain/entities/catalog-request.entity';

export interface CatalogRequestOutput {
  id: string;
  catalogPhoneId: string | null;
  brand: string;
  model: string;
  price: number;
  creditAvailable: boolean;
  requestType: CatalogRequest['requestType'];
  customerName: string;
  customerPhone: string;
  status: CatalogRequest['status'];
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toCatalogRequestOutput(
  request: CatalogRequest,
): CatalogRequestOutput {
  return {
    id: request.id,
    catalogPhoneId: request.catalogPhoneId,
    brand: request.brand,
    model: request.model,
    price: request.price,
    creditAvailable: request.creditAvailable,
    requestType: request.requestType,
    customerName: request.customerName,
    customerPhone: request.customerPhone,
    status: request.status,
    observation: request.observation,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    updatedBy: request.updatedBy,
    updatedByUsername: request.updatedByUsername,
  };
}
