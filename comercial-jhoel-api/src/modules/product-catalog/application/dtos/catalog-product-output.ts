import { CatalogProduct, CatalogProductSection } from '../../domain/entities/catalog-product.entity';

/** Shape admin — incluye estado y datos de auditoría, nunca expuesto sin autenticación. */
export interface CatalogProductOutput {
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
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Shape público — backs Librería/Variedades en la landing. Nunca incluye
 * `isActive`/`productIsActive`/`createdBy*`/`updatedBy*` (una publicación
 * nunca llega aquí a menos que ya esté activa y su producto también, ver
 * `ListPublishedCatalogProductsUseCase`), ni costo/stock/proveedor (esos
 * campos ni siquiera existen en el join que arma este módulo).
 */
export interface PublicCatalogProductOutput {
  id: string;
  section: CatalogProductSection;
  name: string;
  price: number;
  categoryName: string;
  description: string | null;
  hasImage: boolean;
  likesCount: number;
  /** Si el visitante actual (header `X-Visitor-Id`) ya le dio like — `false` sin header (primera visita). */
  liked: boolean;
  unitOfMeasureAbbreviation: string | null;
}

export function toCatalogProductOutput(product: CatalogProduct): CatalogProductOutput {
  return {
    id: product.id,
    productId: product.productId,
    section: product.section,
    catalogDescription: product.catalogDescription,
    hasImage: product.hasImage,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
    likesCount: product.likesCount,
    productName: product.productName,
    productPrice: product.productPrice,
    productIsActive: product.productIsActive,
    categoryName: product.categoryName,
    businessName: product.businessName,
    unitOfMeasureAbbreviation: product.unitOfMeasureAbbreviation,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    createdBy: product.createdBy,
    createdByUsername: product.createdByUsername,
    updatedBy: product.updatedBy,
    updatedByUsername: product.updatedByUsername,
  };
}

export function toPublicCatalogProductOutput(
  product: CatalogProduct,
  likesCount: number,
  liked: boolean,
): PublicCatalogProductOutput {
  return {
    id: product.id,
    section: product.section,
    name: product.productName,
    price: product.productPrice,
    categoryName: product.categoryName,
    description: product.catalogDescription,
    hasImage: product.hasImage,
    likesCount,
    liked,
    unitOfMeasureAbbreviation: product.unitOfMeasureAbbreviation,
  };
}
