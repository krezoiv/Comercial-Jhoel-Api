import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BankOrmEntity } from './bank.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('bank_balances')
export class BankBalanceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bank_id' })
  bankId: string;

  @ManyToOne(() => BankOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bank_id' })
  bank: BankOrmEntity;

  // Plain DATE — a calendar day the user picked, never a timestamptz, so it
  // can't shift under timezone conversion the way created_at legitimately can.
  @Column({ name: 'operation_date', type: 'date' })
  operationDate: string;

  @Column({
    name: 'previous_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  previousBalance: number;

  @Column({
    name: 'final_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  finalBalance: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
