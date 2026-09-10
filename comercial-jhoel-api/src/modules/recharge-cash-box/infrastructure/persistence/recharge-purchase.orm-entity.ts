import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

/**
 * Read-only mapping of `recharge_purchases` — this table is still written
 * EXCLUSIVELY by the `register_recharge_purchase` stored function (never
 * `.save()`/`.insert()` from TypeScript, see `recharges.module.ts`'s own
 * doc comment on why no ORM entity existed for it before). Added here,
 * scoped to reads only, so `TypeOrmRechargeCashBoxRepository` can sum
 * `amount` ("Monto de Compra" — never `credited_amount`, "Monto
 * Acreditado", which only affects `recharge_daily_balances` and is
 * irrelevant to Caja Contable) via TypeORM's query builder instead of raw
 * SQL for this one piece.
 */
@Entity('recharge_purchases')
export class RechargePurchaseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: string;

  /** A voided ("ANULADA") purchase must never count as a Caja Contable expense — see `TypeOrmRechargeCashBoxRepository`'s own `isVoided = false` filters. */
  @Column({ name: 'is_voided', type: 'boolean', default: false })
  isVoided: boolean;
}
