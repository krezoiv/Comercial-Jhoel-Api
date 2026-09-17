import { CatalogProductRequest } from '../../domain/entities/catalog-product-request.entity';

export interface CatalogProductRequestOutput {
  id: string;
  catalogProductId: string;
  productName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: CatalogProductRequest['status'];
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toCatalogProductRequestOutput(
  request: CatalogProductRequest,
): CatalogProductRequestOutput {
  return {
    id: request.id,
    catalogProductId: request.catalogProductId,
    productName: request.productName,
    price: request.price,
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
