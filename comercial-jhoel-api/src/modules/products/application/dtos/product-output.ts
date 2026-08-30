import { Product } from '../../domain/entities/product.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface ProductOutput {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toProductOutput(product: Product): ProductOutput {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    categoryName: product.categoryName,
    businessId: product.businessId,
    businessName: product.businessName,
    costPrice: product.costPrice,
    publicPrice: product.publicPrice,
    wholesalePrice: product.wholesalePrice,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
