import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from '../../domain/entities/inventory-movement.entity';
import { InventoryMovementRepository } from '../../domain/repositories/inventory-movement.repository';
import { InventoryMovementOrmEntity } from './inventory-movement.orm-entity';
import { movementToDomain } from './inventory.mappers';

@Injectable()
export class TypeOrmInventoryMovementRepository implements InventoryMovementRepository {
  constructor(
    @InjectRepository(InventoryMovementOrmEntity)
    private readonly repository: Repository<InventoryMovementOrmEntity>,
  ) {}

  async findByProductId(
    productId: string,
    limit: number,
  ): Promise<InventoryMovement[]> {
    const orms = await this.repository.find({
      where: { productId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
    return orms.map(movementToDomain);
  }
}
