import { TransactionBank } from '../../domain/entities/transaction-bank.entity';

export interface TransactionBankOutput {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
  hasImage: boolean;
  /** 'GUAYACAN' = Cooperativa Guayacán. */
  cashBoxCode: 'GUAYACAN' | null;
  commissionPerTransaction: number | null;
}

export function toTransactionBankOutput(
  transactionBank: TransactionBank,
): TransactionBankOutput {
  return {
    id: transactionBank.id,
    name: transactionBank.name,
    isActive: transactionBank.isActive,
    createdAt: transactionBank.createdAt,
    updatedAt: transactionBank.updatedAt,
    createdBy: transactionBank.createdBy,
    createdByUsername: transactionBank.createdByUsername,
    updatedBy: transactionBank.updatedBy,
    updatedByUsername: transactionBank.updatedByUsername,
    hasImage: transactionBank.hasImage,
    cashBoxCode: transactionBank.cashBoxCode,
    commissionPerTransaction: transactionBank.commissionPerTransaction,
  };
}
