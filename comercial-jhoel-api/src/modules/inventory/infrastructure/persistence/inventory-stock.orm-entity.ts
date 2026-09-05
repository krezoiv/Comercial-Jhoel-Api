import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InventoryLocationOrmEntity } from './inventory-location.orm-entity';

@Entity('inventory_stock')
@Index('UQ_inventory_stock_product_location', ['productId', 'locationId'], {
  unique: true,
})
export class InventoryStockOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @ManyToOne(() => InventoryLocationOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_id' })
  location: InventoryLocationOrmEntity;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'min_stock', type: 'int', default: 0 })
  minStock: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
