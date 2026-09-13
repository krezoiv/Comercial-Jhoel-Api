import { InventoryLocation } from '../../domain/entities/inventory-location.entity';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { InventoryStock } from '../../domain/entities/inventory-stock.entity';
import { InventoryMovement } from '../../domain/entities/inventory-movement.entity';

export interface InventoryLocationOutput {
  id: string;
  name: string;
  isActive: boolean;
}

export function toInventoryLocationOutput(
  location: InventoryLocation,
): InventoryLocationOutput {
  return { id: location.id, name: location.name, isActive: location.isActive };
}

export interface ProductPresentationOutput {
  id: string;
  productId: string;
  presentationTypeId: string;
  name: string;
  conversionFactor: number;
  costPrice: number;
  publicPrice: number;
  barcode: string | null;
  isActive: boolean;
}

export function toProductPresentationOutput(
  presentation: ProductPresentation,
): ProductPresentationOutput {
  return {
    id: presentation.id,
    productId: presentation.productId,
    presentationTypeId: presentation.presentationTypeId,
    name: presentation.name,
    conversionFactor: presentation.conversionFactor,
    costPrice: presentation.costPrice,
    publicPrice: presentation.publicPrice,
    barcode: presentation.barcode,
    isActive: presentation.isActive,
  };
}

export interface StockByLocationOutput {
  locationId: string;
  locationName: string;
  quantity: number;
  minStock: number;
}

export function toStockByLocationOutput(
  stock: InventoryStock,
): StockByLocationOutput {
  return {
    locationId: stock.locationId,
    locationName: stock.locationName,
    quantity: stock.quantity,
    minStock: stock.minStock,
  };
}

export interface InventoryMovementOutput {
  id: string;
  presentationName: string;
  locationFromName: string | null;
  locationToName: string | null;
  movementType: string;
  quantityPresentation: number;
  conversionFactor: number;
  quantityBaseUnits: number;
  referenceType: string | null;
  referenceId: string | null;
  username: string;
  reason: string | null;
  createdAt: Date;
}

export function toInventoryMovementOutput(
  movement: InventoryMovement,
): InventoryMovementOutput {
  return {
    id: movement.id,
    presentationName: movement.presentationName,
    locationFromName: movement.locationFromName,
    locationToName: movement.locationToName,
    movementType: movement.movementType,
    quantityPresentation: movement.quantityPresentation,
    conversionFactor: movement.conversionFactor,
    quantityBaseUnits: movement.quantityBaseUnits,
    referenceType: movement.referenceType,
    referenceId: movement.referenceId,
    username: movement.username,
    reason: movement.reason,
    createdAt: movement.createdAt,
  };
}

export interface ProductInventoryDetailOutput {
  productId: string;
  productName: string;
  sku: string | null;
  categoryName: string;
  totalStock: number;
  stockByLocation: StockByLocationOutput[];
  presentations: ProductPresentationOutput[];
  recentMovements: InventoryMovementOutput[];
}
