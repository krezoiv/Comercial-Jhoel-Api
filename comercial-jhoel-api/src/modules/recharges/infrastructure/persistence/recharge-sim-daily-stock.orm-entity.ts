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
import { RechargeSimTypeOrmEntity } from './recharge-sim-type.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('recharge_sim_daily_stock')
@Index('UQ_recharge_sim_daily_stock_type_date', ['simTypeId', 'date'], {
  unique: true,
})
export class RechargeSimDailyStockOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sim_type_id' })
  simTypeId: string;

  @ManyToOne(() => RechargeSimTypeOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'sim_type_id' })
  simType: RechargeSimTypeOrmEntity;

  // `type: 'date'` hydrates as a plain `yyyy-MM-dd` string on entity reads —
  // same convention as `RechargeDailyBalanceOrmEntity.date`.
  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'previous_stock', type: 'int' })
  previousStock: number;

  @Column({ name: 'current_stock', type: 'int' })
  currentStock: number;

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
