import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

/** Read-only mapping of `recharge_sim_sales` — written exclusively by `register_recharge_sim_sale`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Ventas de SIM" aggregation. */
@Entity('recharge_sim_sales')
export class RechargeSimSaleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalAmount: number;

  @Column({ name: 'sale_date', type: 'date' })
  saleDate: string;
}
