import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

/** Read-only mapping of `recharge_sim_purchases` — written exclusively by `register_recharge_sim_purchase`; added here, scoped to reads only, for `TypeOrmRechargeCashBoxRepository`'s "Compras de SIM" aggregation. */
@Entity('recharge_sim_purchases')
export class RechargeSimPurchaseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'total_cost',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalCost: number;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: string;
}
