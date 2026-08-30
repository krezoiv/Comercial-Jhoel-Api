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
import { RechargeTypeOrmEntity } from './recharge-type.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('recharge_daily_balances')
@Index(
  'UQ_recharge_daily_balances_type_date_sequence',
  ['rechargeTypeId', 'date', 'sequence'],
  { unique: true },
)
export class RechargeDailyBalanceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recharge_type_id' })
  rechargeTypeId: string;

  @ManyToOne(() => RechargeTypeOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recharge_type_id' })
  rechargeType: RechargeTypeOrmEntity;

  // `type: 'date'` — TypeORM hydrates this as a plain `yyyy-MM-dd` string on
  // entity reads (not a JS `Date`), which is exactly the shape this module
  // works with everywhere else; no timezone-conversion helper needed here.
  @Column({ type: 'date' })
  date: string;

  /** Which cuadre cycle this row is within (rechargeType, date) — see the domain entity's own doc comment. */
  @Column({ type: 'int' })
  sequence: number;

  @Column({
    name: 'previous_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  previousBalance: number;

  @Column({
    name: 'daily_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  dailyBalance: number;

  @Column({
    name: 'final_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: new DecimalColumnTransformer(),
  })
  finalBalance: number | null;

  @Column({ name: 'created_by' })
  createdByUserId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;

  @Column({ name: 'updated_by', nullable: true, type: 'uuid' })
  updatedByUserId: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
