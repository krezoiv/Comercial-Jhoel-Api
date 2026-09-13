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
  barcode?: string | null;
}

export interface UpdatePresentationData {
  presentationTypeId?: string;
  conversionFactor?: number;
  costPrice?: number;
  publicPrice?: number;
  barcode?: string | null;
  isActive?: boolean;
}

export interface ProductPresentationRepository {
  findByProductId(
    productId: string,
    options?: { activeOnly?: boolean },
  ): Promise<ProductPresentation[]>;
  findById(id: string): Promise<ProductPresentation | null>;
  /** Active presentations only — barcodes are globally unique among them. Used to pre-check a collision before a write that would otherwise leave a half-created product behind (see `CreateProductUseCase`'s own doc comment). */
  findActiveByBarcode(barcode: string): Promise<ProductPresentation | null>;
  create(data: CreatePresentationData): Promise<ProductPresentation>;
  update(
    id: string,
    data: UpdatePresentationData,
  ): Promise<ProductPresentation>;
  /**
   * One active presentation per product (the first match, if more than
   * one somehow matched — barcodes are globally unique among active rows,
   * so this is a defensive cap, not an expected case) whose barcode
   * `ILIKE` the given search term, scoped to `productIds` — backs
   * `ListProductsUseCase`'s "which presentation did this scan actually
   * mean" resolution. Returns an empty map for an empty `productIds` or
   * a blank `search`.
   */
  findMatchingByBarcode(
    productIds: string[],
    search: string,
  ): Promise<Map<string, ProductPresentation>>;
  /**
   * Called by `DeactivateProductUseCase` — a product, once deactivated,
   * has no reactivation path anywhere in this codebase, so its
   * presentations (including "Unidad", bypassing its own
   * `UnidadPresentationImmutableError` gate — that gate protects against
   * an *admin* edit, not this internal system action) are deactivated
   * alongside it. This is what keeps a barcode's global uniqueness
   * meaningful: without it, a deactivated product's still-"active"
   * presentation would permanently occupy its barcode, unlike
   * `products.sku` (whose own uniqueness is scoped to the *same* row's
   * `is_active` flag, so it already frees up correctly on deactivation).
   */
  deactivateAllForProduct(productId: string): Promise<void>;
}
