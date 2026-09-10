import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductOrmEntity } from '../../../products/infrastructure/persistence/product.orm-entity';
import { ProductPresentationOrmEntity } from '../../../inventory/infrastructure/persistence/product-presentation.orm-entity';
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

  // Nullable — rows from before `CreateInventoryLocationsAndPresentations`
  // never got one, and `confirm_purchase` itself falls back to "Unidad"
  // silently when omitted. Eager so the mapper can resolve a display name
  // without a second query, same pattern as every other eager relation here.
  @Column({ name: 'presentation_id', type: 'uuid', nullable: true })
  presentationId: string | null;

  @ManyToOne(() => ProductPresentationOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'presentation_id' })
  presentation: ProductPresentationOrmEntity | null;
}
