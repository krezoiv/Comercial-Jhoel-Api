import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryOrmEntity } from '../../../categories/infrastructure/persistence/category.orm-entity';
import { BusinessOrmEntity } from '../../../businesses/infrastructure/persistence/business.orm-entity';
import { UnitOfMeasureOrmEntity } from '../../../units-of-measure/infrastructure/persistence/unit-of-measure.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

// Name is unique only among *active* products — a deactivated product's name
// can be reused (matches the migration's partial unique index).
@Entity('products')
@Index('UQ_products_name_active', ['name'], {
  unique: true,
  where: '"is_active" = true',
})
@Index('UQ_products_sku_active', ['sku'], {
  unique: true,
  where: '"is_active" = true',
})
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  // Barcode/SKU — unique only among *active* products (same partial-index pattern as `name`).
  @Column({ type: 'varchar', length: 64, nullable: true })
  sku: string | null;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => CategoryOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryOrmEntity;

  @Column({ name: 'business_id' })
  businessId: string;

  @ManyToOne(() => BusinessOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'business_id' })
  business: BusinessOrmEntity;

  @Column({ name: 'unit_of_measure_id' })
  unitOfMeasureId: string;

  @ManyToOne(() => UnitOfMeasureOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unit_of_measure_id' })
  unitOfMeasure: UnitOfMeasureOrmEntity;

  // numeric(12,2): exact decimal storage, no float rounding — see DecimalColumnTransformer.
  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  costPrice: number;

  @Column({
    name: 'public_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  publicPrice: number;

  @Column({
    name: 'wholesale_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  wholesalePrice: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
