import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryLocation } from '../../domain/entities/inventory-location.entity';
import { InventoryLocationRepository } from '../../domain/repositories/inventory-location.repository';
import { InventoryLocationOrmEntity } from './inventory-location.orm-entity';
import { locationToDomain } from './inventory.mappers';

@Injectable()
export class TypeOrmInventoryLocationRepository implements InventoryLocationRepository {
  constructor(
    @InjectRepository(InventoryLocationOrmEntity)
    private readonly repository: Repository<InventoryLocationOrmEntity>,
  ) {}

  async findAll(options?: {
    activeOnly?: boolean;
  }): Promise<InventoryLocation[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map(locationToDomain);
  }

  async findById(id: string): Promise<InventoryLocation | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? locationToDomain(orm) : null;
  }
}
