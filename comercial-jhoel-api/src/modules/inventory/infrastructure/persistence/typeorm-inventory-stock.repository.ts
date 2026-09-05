import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryStock } from '../../domain/entities/inventory-stock.entity';
import {
  InitialStockEntry,
  InventoryStockRepository,
  LowStockRow,
} from '../../domain/repositories/inventory-stock.repository';
import { InventoryStockOrmEntity } from './inventory-stock.orm-entity';
import { stockToDomain } from './inventory.mappers';

@Injectable()
export class TypeOrmInventoryStockRepository implements InventoryStockRepository {
  constructor(
    @InjectRepository(InventoryStockOrmEntity)
    private readonly repository: Repository<InventoryStockOrmEntity>,
  ) {}

  async findByProductId(productId: string): Promise<InventoryStock[]> {
    const orms = await this.repository.find({
      where: { productId },
      order: { location: { name: 'ASC' } },
    });
    return orms.map(stockToDomain);
  }

  async findByProductIds(
    productIds: string[],
  ): Promise<Map<string, InventoryStock[]>> {
    const map = new Map<string, InventoryStock[]>();
    if (productIds.length === 0) {
      return map;
    }
    const orms = await this.repository.find({
      where: { productId: In(productIds) },
      order: { location: { name: 'ASC' } },
    });
    for (const orm of orms) {
      const stock = stockToDomain(orm);
      const existing = map.get(orm.productId) ?? [];
      existing.push(stock);
      map.set(orm.productId, existing);
    }
    return map;
  }

  async createInitial(
    productId: string,
    entries: InitialStockEntry[],
  ): Promise<void> {
    if (entries.length === 0) {
      return;
    }
    await this.repository.insert(
      entries.map((entry) => ({
        productId,
        locationId: entry.locationId,
        quantity: entry.quantity,
      })),
    );
  }

  async setMinStock(
    productId: string,
    locationId: string,
    minStock: number,
  ): Promise<InventoryStock> {
    const result = await this.repository.update(
      { productId, locationId },
      { minStock },
    );
    if (!result.affected) {
      throw new InternalServerErrorException(
        `No existe una fila de inventario para el producto ${productId} en la ubicación ${locationId}.`,
      );
    }
    const orm = await this.repository.findOne({
      where: { productId, locationId },
    });
    return stockToDomain(orm!);
  }

  /** No formal ORM relation to `ProductOrmEntity` exists on this entity (this module never joins to `products` — it only stores `productId` as a plain column, same convention every other ORM entity here follows), so the product name is joined via a raw table name rather than a relation path. */
  async findLowStock(): Promise<LowStockRow[]> {
    const rows = await this.repository
      .createQueryBuilder('stock')
      .innerJoin('products', 'product', 'product.id = stock.productId')
      .innerJoin('stock.location', 'location')
      .select('stock.productId', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('stock.locationId', 'locationId')
      .addSelect('location.name', 'locationName')
      .addSelect('stock.quantity', 'quantity')
      .addSelect('stock.minStock', 'minStock')
      .where('stock.minStock > 0')
      .andWhere('stock.quantity <= stock.minStock')
      .andWhere('product.isActive = true')
      .orderBy('stock.quantity', 'ASC')
      .getRawMany<{
        productId: string;
        productName: string;
        locationId: string;
        locationName: string;
        quantity: number;
        minStock: number;
      }>();

    return rows.map((row) => ({
      productId: row.productId,
      productName: row.productName,
      locationId: row.locationId,
      locationName: row.locationName,
      quantity: row.quantity,
      minStock: row.minStock,
    }));
  }
}
