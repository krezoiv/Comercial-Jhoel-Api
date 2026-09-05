import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductPresentationOrmEntity } from './product-presentation.orm-entity';
import { InventoryLocationOrmEntity } from './inventory-location.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('inventory_movements')
@Index('IDX_inventory_movements_product_id', ['productId'])
export class InventoryMovementOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'presentation_id' })
  presentationId: string;

  @ManyToOne(() => ProductPresentationOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'presentation_id' })
  presentation: ProductPresentationOrmEntity;

  @Column({ name: 'location_from_id', nullable: true, type: 'uuid' })
  locationFromId: string | null;

  @ManyToOne(() => InventoryLocationOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_from_id' })
  locationFrom: InventoryLocationOrmEntity | null;

  @Column({ name: 'location_to_id', nullable: true, type: 'uuid' })
  locationToId: string | null;

  @ManyToOne(() => InventoryLocationOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'location_to_id' })
  locationTo: InventoryLocationOrmEntity | null;

  @Column({ name: 'movement_type', type: 'varchar', length: 30 })
  movementType: string;

  @Column({ name: 'quantity_presentation', type: 'int' })
  quantityPresentation: number;

  @Column({ name: 'conversion_factor', type: 'int' })
  conversionFactor: number;

  @Column({ name: 'quantity_base_units', type: 'int' })
  quantityBaseUnits: number;

  @Column({
    name: 'reference_type',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  referenceType: string | null;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
