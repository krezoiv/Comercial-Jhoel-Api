import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { TransactionBankOrmEntity } from '../../../transaction-banks/infrastructure/persistence/transaction-bank.orm-entity';
import { TransactionTypeOrmEntity } from '../../../transaction-types/infrastructure/persistence/transaction-type.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { BankDepositCashDetailOrmEntity } from './bank-deposit-cash-detail.orm-entity';
import { BankDepositTransactionOrmEntity } from './bank-deposit-transaction.orm-entity';

@Entity('bank_deposit_operations')
export class BankDepositOperationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_bank_id' })
  transactionBankId: string;

  @ManyToOne(() => TransactionBankOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'transaction_bank_id' })
  transactionBank: TransactionBankOrmEntity;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalAmount: number;

  @Column({ name: 'transaction_count', type: 'int' })
  transactionCount: number;

  @Column({
    name: 'total_cash',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalCash: number;

  @Column({
    name: 'total_distributed',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalDistributed: number;

  @Column({ name: 'operation_date', type: 'date' })
  operationDate: string;

  /** "Vuelto" — cash handed back to the client. `total_cash - change_given` is always the net amount actually applied to the deposit; `total_cash` alone is the gross cash received, kept for audit. */
  @Column({
    name: 'change_given',
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  changeGiven: number;

  @Column({ name: 'client_name', type: 'varchar', length: 150, nullable: true })
  clientName: string | null;

  @Column({ name: 'transaction_type_id' })
  transactionTypeId: string;

  @ManyToOne(() => TransactionTypeOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionTypeOrmEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @OneToMany(() => BankDepositCashDetailOrmEntity, (detail) => detail.operation)
  cashDetails: BankDepositCashDetailOrmEntity[];

  @OneToMany(
    () => BankDepositTransactionOrmEntity,
    (transaction) => transaction.operation,
  )
  transactions: BankDepositTransactionOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_voided', type: 'boolean', default: false })
  isVoided: boolean;

  @Column({ name: 'voided_at', type: 'timestamptz', nullable: true })
  voidedAt: Date | null;

  @Column({ name: 'voided_by', type: 'uuid', nullable: true })
  voidedBy: string | null;

  @ManyToOne(() => UserOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'voided_by' })
  voidedByUser: UserOrmEntity | null;

  @Column({ name: 'void_reason', type: 'text', nullable: true })
  voidReason: string | null;
}
