import type { CatalogProductRequestStatus } from '../../domain/entities/catalog-product-request.entity';

export class CatalogProductRequestResponseDto {
  id: string;
  catalogProductId: string;
  productName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  status: CatalogProductRequestStatus;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
