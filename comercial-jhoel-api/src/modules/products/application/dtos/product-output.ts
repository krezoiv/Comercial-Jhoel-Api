import { Product } from '../../domain/entities/product.entity';
import { InventoryStock } from '../../../inventory/domain/entities/inventory-stock.entity';
import { ProductPresentation } from '../../../inventory/domain/entities/product-presentation.entity';

export interface StockByLocationOutput {
  locationId: string;
  locationName: string;
  quantity: number;
}

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface ProductOutput {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  unitOfMeasureAbbreviation: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  /** Present only when the caller resolved locations alongside the product (see `withStockByLocation`) — `stock` above remains the always-present running total. */
  stockByLocation?: StockByLocationOutput[];
  /** Present only on a search result whose match came from a presentation's own barcode (not the product's name/sku) — see `withMatchedPresentation`. Lets a caller (e.g. Compras' item row) pre-select the scanned presentation instead of defaulting to "Unidad". */
  matchedPresentation?: {
    id: string;
    name: string;
    conversionFactor: number;
    costPrice: number;
    publicPrice: number;
  };
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
    unitOfMeasureId: product.unitOfMeasureId,
    unitOfMeasureName: product.unitOfMeasureName,
    unitOfMeasureAbbreviation: product.unitOfMeasureAbbreviation,
    costPrice: product.costPrice,
    publicPrice: product.publicPrice,
    wholesalePrice: product.wholesalePrice,
    stock: product.stock,
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function withMatchedPresentation(
  output: ProductOutput,
  presentation: ProductPresentation,
): ProductOutput {
  return {
    ...output,
    matchedPresentation: {
      id: presentation.id,
      name: presentation.name,
      conversionFactor: presentation.conversionFactor,
      costPrice: presentation.costPrice,
      publicPrice: presentation.publicPrice,
    },
  };
}

export function withStockByLocation(
  output: ProductOutput,
  stock: InventoryStock[],
): ProductOutput {
  return {
    ...output,
    stockByLocation: stock.map((row) => ({
      locationId: row.locationId,
      locationName: row.locationName,
      quantity: row.quantity,
    })),
  };
}
