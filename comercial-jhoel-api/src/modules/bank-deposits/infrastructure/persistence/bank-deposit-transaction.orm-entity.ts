import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { BankDepositOperationOrmEntity } from './bank-deposit-operation.orm-entity';

@Entity('bank_deposit_transactions')
export class BankDepositTransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'operation_id' })
  operationId: string;

  @ManyToOne(
    () => BankDepositOperationOrmEntity,
    (operation) => operation.transactions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'operation_id' })
  operation: BankDepositOperationOrmEntity;

  @Column({ type: 'int' })
  sequence: number;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;
}
