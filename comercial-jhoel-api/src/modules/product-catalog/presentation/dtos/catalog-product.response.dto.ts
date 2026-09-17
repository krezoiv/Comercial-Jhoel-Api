import type { CatalogProductSection } from '../../domain/entities/catalog-product.entity';

export class CatalogProductResponseDto {
  id: string;
  productId: string;
  section: CatalogProductSection;
  catalogDescription: string | null;
  hasImage: boolean;
  isActive: boolean;
  sortOrder: number;
  productName: string;
  productPrice: number;
  productIsActive: boolean;
  categoryName: string;
  businessName: string;
  unitOfMeasureAbbreviation: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
