import {
  TransactionType,
  TransactionTypeBalanceEffect,
} from '../entities/transaction-type.entity';

export const TRANSACTION_TYPE_REPOSITORY = Symbol(
  'TRANSACTION_TYPE_REPOSITORY',
);

export interface CreateTransactionTypeData {
  name: string;
  icon: string;
  balanceEffect: TransactionTypeBalanceEffect | null;
  createdBy: string;
}

export interface UpdateTransactionTypeData {
  name?: string;
  icon?: string;
  balanceEffect?: TransactionTypeBalanceEffect | null;
  updatedBy: string;
}

export interface FindTransactionTypesOptions {
  activeOnly: boolean;
}

export interface TransactionTypeRepository {
  findAll(options: FindTransactionTypesOptions): Promise<TransactionType[]>;
  findById(id: string): Promise<TransactionType | null>;
  findByActiveName(name: string): Promise<TransactionType | null>;
  create(data: CreateTransactionTypeData): Promise<TransactionType>;
  update(id: string, data: UpdateTransactionTypeData): Promise<TransactionType>;
  deactivate(id: string): Promise<void>;
}
