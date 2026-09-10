import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RechargeTypeOrmEntity } from './recharge-type.orm-entity';
import { RechargeDailyBalanceOrmEntity } from './recharge-daily-balance.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

/**
 * Full mapping of `recharge_purchases` — used for the "Compras de
 * Recargas" list/revert feature (`RechargePurchaseRepository`). Named
 * `...Full...` to avoid colliding with the pre-existing, deliberately
 * minimal `RechargePurchaseOrmEntity` in `modules/recharge-cash-box/`
 * (only `id`/`amount`/`purchaseDate`, used exclusively for Caja
 * Contable's own SUM aggregates) — both map the same table, the exact
 * same safe multi-entity pattern already used for `RechargeSaleOrmEntity`
 * elsewhere in this codebase.
 */
@Entity('recharge_purchases')
export class RechargePurchaseFullOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recharge_type_id' })
  @Index('IDX_recharge_purchases_full_type_id')
  rechargeTypeId: string;

  @ManyToOne(() => RechargeTypeOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recharge_type_id' })
  rechargeType: RechargeTypeOrmEntity;

  @Column({ name: 'daily_balance_id' })
  @Index('IDX_recharge_purchases_full_daily_balance_id')
  dailyBalanceId: string;

  // Eager so the mapper can derive `locked` from `dailyBalance.finalBalance`
  // without a second query — same pattern as `RechargeSaleOrmEntity`.
  @ManyToOne(() => RechargeDailyBalanceOrmEntity, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'daily_balance_id' })
  dailyBalance: RechargeDailyBalanceOrmEntity;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({
    name: 'credited_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  creditedAmount: number;

  // `type: 'date'` — hydrates as a plain `yyyy-MM-dd` string, same
  // documented TypeORM behavior every other Recargas date column relies on.
  @Column({ name: 'purchase_date', type: 'date' })
  @Index('IDX_recharge_purchases_full_purchase_date')
  date: string;

  @Column({ name: 'created_by' })
  createdByUserId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_voided', type: 'boolean', default: false })
  isVoided: boolean;

  @Column({ name: 'voided_at', type: 'timestamptz', nullable: true })
  voidedAt: Date | null;

  @Column({ name: 'voided_by', type: 'uuid', nullable: true })
  voidedByUserId: string | null;

  @ManyToOne(() => UserOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'voided_by' })
  voidedByUser: UserOrmEntity | null;

  @Column({ name: 'void_reason', type: 'varchar', length: 255, nullable: true })
  voidReason: string | null;
}
