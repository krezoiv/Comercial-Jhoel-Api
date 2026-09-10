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
import { SaleOrmEntity } from './sale.orm-entity';

@Entity('sale_details')
export class SaleDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sale_id' })
  saleId: string;

  @ManyToOne(() => SaleOrmEntity, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: SaleOrmEntity;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @Column({ type: 'int' })
  quantity: number;

  // Frozen at the moment of sale — never recomputed from the live product.
  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  unitPrice: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  total: number;

  // Nullable — rows from before `CreateInventoryLocationsAndPresentations`
  // never got one, and `adjust_sale_item`/`confirm_sale` fall back to
  // "Unidad" silently when omitted. Eager so the mapper can resolve a
  // display name without a second query, same pattern as `PurchaseDetailOrmEntity`.
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
