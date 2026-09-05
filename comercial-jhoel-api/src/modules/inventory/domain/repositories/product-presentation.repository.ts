import { ProductPresentation } from '../entities/product-presentation.entity';

export const PRODUCT_PRESENTATION_REPOSITORY = Symbol(
  'PRODUCT_PRESENTATION_REPOSITORY',
);

export interface CreatePresentationData {
  productId: string;
  presentationTypeId: string;
  conversionFactor: number;
  costPrice: number;
  publicPrice: number;
}

export interface UpdatePresentationData {
  presentationTypeId?: string;
  conversionFactor?: number;
  costPrice?: number;
  publicPrice?: number;
  isActive?: boolean;
}

export interface ProductPresentationRepository {
  findByProductId(
    productId: string,
    options?: { activeOnly?: boolean },
  ): Promise<ProductPresentation[]>;
  findById(id: string): Promise<ProductPresentation | null>;
  create(data: CreatePresentationData): Promise<ProductPresentation>;
  update(
    id: string,
    data: UpdatePresentationData,
  ): Promise<ProductPresentation>;
}
