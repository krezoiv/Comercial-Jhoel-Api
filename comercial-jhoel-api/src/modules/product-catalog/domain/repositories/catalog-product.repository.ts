import { CatalogProduct, CatalogProductSection } from '../entities/catalog-product.entity';

export const CATALOG_PRODUCT_REPOSITORY = Symbol('CATALOG_PRODUCT_REPOSITORY');

export interface CreateCatalogProductData {
  productId: string;
  section: CatalogProductSection;
  catalogDescription: string | null;
  createdBy: string;
}

export interface UpdateCatalogProductData {
  catalogDescription?: string | null;
  updatedBy: string;
}

export interface ListCatalogProductsOptions {
  section: CatalogProductSection;
  includeInactive?: boolean;
  search?: string;
}

export interface ReorderCatalogProductItem {
  id: string;
  sortOrder: number;
}

export interface CatalogProductImageBytes {
  data: Buffer;
  mimeType: string;
  catalogProductId: string;
}

export interface CatalogProductRepository {
  findAll(options: ListCatalogProductsOptions): Promise<CatalogProduct[]>;
  findById(id: string): Promise<CatalogProduct | null>;
  /** Público — solo `isActive && product.isActive`, ordenado por `sortOrder`. */
  findPublished(section: CatalogProductSection): Promise<CatalogProduct[]>;
  /** Para validar que un producto no esté ya publicado dos veces en la misma sección (aviso suave, no constraint de BD). */
  findByProductAndSection(
    productId: string,
    section: CatalogProductSection,
  ): Promise<CatalogProduct | null>;
  create(data: CreateCatalogProductData): Promise<CatalogProduct>;
  update(id: string, data: UpdateCatalogProductData): Promise<CatalogProduct>;
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  reorder(items: ReorderCatalogProductItem[]): Promise<void>;
  /** Incremento atómico (`delta` +1/-1) — nunca lee-modifica-escribe desde la aplicación. Nunca baja de 0. Devuelve el conteo resultante. */
  adjustLikes(id: string, delta: number): Promise<number>;
  setImage(
    id: string,
    image: { data: Buffer; mimeType: string; sizeBytes: number },
    updatedBy: string,
  ): Promise<void>;
  removeImage(id: string, updatedBy: string): Promise<void>;
  getImage(id: string): Promise<CatalogProductImageBytes | null>;
}
