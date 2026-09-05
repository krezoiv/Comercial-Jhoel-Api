import { TransactionBank } from '../entities/transaction-bank.entity';

export const TRANSACTION_BANK_REPOSITORY = Symbol(
  'TRANSACTION_BANK_REPOSITORY',
);

export interface CreateTransactionBankData {
  name: string;
  createdBy: string;
}

export interface UpdateTransactionBankData {
  name?: string;
  updatedBy: string;
}

export interface FindTransactionBanksOptions {
  activeOnly: boolean;
}

export interface TransactionBankRepository {
  findAll(options: FindTransactionBanksOptions): Promise<TransactionBank[]>;
  findById(id: string): Promise<TransactionBank | null>;
  findByActiveName(name: string): Promise<TransactionBank | null>;
  create(data: CreateTransactionBankData): Promise<TransactionBank>;
  update(id: string, data: UpdateTransactionBankData): Promise<TransactionBank>;
  deactivate(id: string): Promise<void>;
}
