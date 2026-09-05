import { Inject, Injectable } from '@nestjs/common';
import { INVENTORY_LOCATION_REPOSITORY } from '../../domain/repositories/inventory-location.repository';
import type { InventoryLocationRepository } from '../../domain/repositories/inventory-location.repository';
import {
  InventoryLocationOutput,
  toInventoryLocationOutput,
} from '../dtos/inventory-output';

@Injectable()
export class ListInventoryLocationsUseCase {
  constructor(
    @Inject(INVENTORY_LOCATION_REPOSITORY)
    private readonly locationRepository: InventoryLocationRepository,
  ) {}

  async execute(): Promise<InventoryLocationOutput[]> {
    const locations = await this.locationRepository.findAll({
      activeOnly: true,
    });
    return locations.map(toInventoryLocationOutput);
  }
}
