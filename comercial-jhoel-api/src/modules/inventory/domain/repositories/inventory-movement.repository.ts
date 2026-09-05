import { InventoryMovement } from '../entities/inventory-movement.entity';

export const INVENTORY_MOVEMENT_REPOSITORY = Symbol(
  'INVENTORY_MOVEMENT_REPOSITORY',
);

export interface InventoryMovementRepository {
  /** Most recent movements for a product, newest first. */
  findByProductId(
    productId: string,
    limit: number,
  ): Promise<InventoryMovement[]>;
}
