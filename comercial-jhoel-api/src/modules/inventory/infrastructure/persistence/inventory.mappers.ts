import { InventoryLocation } from '../../domain/entities/inventory-location.entity';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { InventoryStock } from '../../domain/entities/inventory-stock.entity';
import {
  InventoryMovement,
  InventoryMovementType,
} from '../../domain/entities/inventory-movement.entity';
import { InventoryLocationOrmEntity } from './inventory-location.orm-entity';
import { ProductPresentationOrmEntity } from './product-presentation.orm-entity';
import { InventoryStockOrmEntity } from './inventory-stock.orm-entity';
import { InventoryMovementOrmEntity } from './inventory-movement.orm-entity';

export function locationToDomain(
  orm: InventoryLocationOrmEntity,
): InventoryLocation {
  return InventoryLocation.create({
    id: orm.id,
    name: orm.name,
    isActive: orm.isActive,
    createdAt: orm.createdAt,
    updatedAt: orm.updatedAt,
  });
}

export function presentationToDomain(
  orm: ProductPresentationOrmEntity,
): ProductPresentation {
  return ProductPresentation.create({
    id: orm.id,
    productId: orm.productId,
    presentationTypeId: orm.presentationTypeId,
    name: orm.presentationType?.name ?? '—',
    conversionFactor: orm.conversionFactor,
    costPrice: orm.costPrice,
    publicPrice: orm.publicPrice,
    isActive: orm.isActive,
    createdAt: orm.createdAt,
    updatedAt: orm.updatedAt,
  });
}

export function stockToDomain(orm: InventoryStockOrmEntity): InventoryStock {
  return InventoryStock.create({
    productId: orm.productId,
    locationId: orm.locationId,
    locationName: orm.location?.name ?? '—',
    quantity: orm.quantity,
    minStock: orm.minStock,
    updatedAt: orm.updatedAt,
  });
}

export function movementToDomain(
  orm: InventoryMovementOrmEntity,
): InventoryMovement {
  return InventoryMovement.create({
    id: orm.id,
    productId: orm.productId,
    presentationId: orm.presentationId,
    presentationName: orm.presentation?.presentationType?.name ?? '—',
    locationFromId: orm.locationFromId,
    locationFromName: orm.locationFrom?.name ?? null,
    locationToId: orm.locationToId,
    locationToName: orm.locationTo?.name ?? null,
    movementType: orm.movementType as InventoryMovementType,
    quantityPresentation: orm.quantityPresentation,
    conversionFactor: orm.conversionFactor,
    quantityBaseUnits: orm.quantityBaseUnits,
    referenceType: orm.referenceType,
    referenceId: orm.referenceId,
    userId: orm.userId,
    username: orm.user?.username ?? '—',
    reason: orm.reason,
    createdAt: orm.createdAt,
  });
}
