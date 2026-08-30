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
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('recharge_sales_closures')
@Index('UQ_recharge_sales_closures_date_sequence', ['date', 'sequence'], {
  unique: true,
})
export class RechargeSalesClosureOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // `type: 'date'` — hydrates as a plain `yyyy-MM-dd` string on entity
  // reads, same documented TypeORM behavior `RechargeDailyBalanceOrmEntity`
  // already relies on.
  @Column({ type: 'date' })
  date: string;

  /** Which cuadre cycle of `date` this closure is for — see `RechargeDailyBalanceOrmEntity.sequence`. */
  @Column({ type: 'int' })
  sequence: number;

  @Column({
    name: 'total_sales',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalSales: number;

  @Column({
    name: 'total_collected',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalCollected: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  result: number;

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
