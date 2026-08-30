import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IceCreamOrmEntity } from './ice-cream.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { IceCreamPurchaseOrmEntity } from './ice-cream-purchase.orm-entity';

@Entity('ice_cream_purchase_details')
export class IceCreamPurchaseDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'purchase_id' })
  purchaseId: string;

  @ManyToOne(() => IceCreamPurchaseOrmEntity, (purchase) => purchase.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: IceCreamPurchaseOrmEntity;

  @Column({ name: 'ice_cream_id' })
  iceCreamId: string;

  @ManyToOne(() => IceCreamOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ice_cream_id' })
  iceCream: IceCreamOrmEntity;

  @Column({ type: 'int' })
  quantity: number;

  // Frozen at the moment of purchase — never recomputed from the live helado.
  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  costPrice: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  subtotal: number;
}
