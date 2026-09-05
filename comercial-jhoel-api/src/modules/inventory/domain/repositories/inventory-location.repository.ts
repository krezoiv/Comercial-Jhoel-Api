import { InventoryLocation } from '../entities/inventory-location.entity';

export const INVENTORY_LOCATION_REPOSITORY = Symbol(
  'INVENTORY_LOCATION_REPOSITORY',
);

export interface InventoryLocationRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<InventoryLocation[]>;
  findById(id: string): Promise<InventoryLocation | null>;
}
