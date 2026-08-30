import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IceCreamOrmEntity } from './ice-cream.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { IceCreamSaleOrmEntity } from './ice-cream-sale.orm-entity';

@Entity('ice_cream_sale_details')
export class IceCreamSaleDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sale_id' })
  saleId: string;

  @ManyToOne(() => IceCreamSaleOrmEntity, (sale) => sale.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sale_id' })
  sale: IceCreamSaleOrmEntity;

  @Column({ name: 'ice_cream_id' })
  iceCreamId: string;

  @ManyToOne(() => IceCreamOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ice_cream_id' })
  iceCream: IceCreamOrmEntity;

  @Column({ type: 'int' })
  quantity: number;

  // Frozen at the moment of sale — the helado's public price when this line was created, never recomputed.
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
}
