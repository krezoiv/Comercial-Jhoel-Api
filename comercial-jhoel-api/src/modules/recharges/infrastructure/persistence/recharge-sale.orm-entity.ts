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
import { RechargeDailyBalanceOrmEntity } from './recharge-daily-balance.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('recharge_sales')
export class RechargeSaleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recharge_type_id' })
  @Index('IDX_recharge_sales_type_id')
  rechargeTypeId: string;

  @ManyToOne(() => RechargeTypeOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'recharge_type_id' })
  rechargeType: RechargeTypeOrmEntity;

  @Column({ name: 'daily_balance_id' })
  @Index('IDX_recharge_sales_daily_balance_id')
  dailyBalanceId: string;

  // Eager so `RechargeSaleMapper` can derive `locked` from
  // `dailyBalance.finalBalance` without a second query.
  @ManyToOne(() => RechargeDailyBalanceOrmEntity, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'daily_balance_id' })
  dailyBalance: RechargeDailyBalanceOrmEntity;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  // `type: 'date'` — hydrates as a plain `yyyy-MM-dd` string, same documented
  // TypeORM behavior `RechargeDailyBalanceOrmEntity.date` already relies on.
  @Column({ name: 'sale_date', type: 'date' })
  @Index('IDX_recharge_sales_sale_date')
  date: string;

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
