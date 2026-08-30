import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOrmEntity } from '../../../products/infrastructure/persistence/product.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { PurchaseOrmEntity } from './purchase.orm-entity';

@Entity('purchase_details')
export class PurchaseDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'purchase_id' })
  purchaseId: string;

  @ManyToOne(() => PurchaseOrmEntity, (purchase) => purchase.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseOrmEntity;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @Column({ type: 'int' })
  quantity: number;

  // Frozen at the moment of purchase — never recomputed from the live product.
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
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  total: number;
}
