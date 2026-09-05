import { TransactionType } from '../../domain/entities/transaction-type.entity';

export interface TransactionTypeOutput {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toTransactionTypeOutput(
  transactionType: TransactionType,
): TransactionTypeOutput {
  return {
    id: transactionType.id,
    name: transactionType.name,
    icon: transactionType.icon,
    isActive: transactionType.isActive,
    createdAt: transactionType.createdAt,
    updatedAt: transactionType.updatedAt,
    createdBy: transactionType.createdBy,
    createdByUsername: transactionType.createdByUsername,
    updatedBy: transactionType.updatedBy,
    updatedByUsername: transactionType.updatedByUsername,
  };
}
