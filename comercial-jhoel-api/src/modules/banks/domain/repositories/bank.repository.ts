import { Bank } from '../entities/bank.entity';

export const BANK_REPOSITORY = Symbol('BANK_REPOSITORY');

export interface CreateBankData {
  name: string;
  accountNumber: string;
  accountTypeId: string;
  previousBalance: number;
  finalBalance: number;
  createdBy: string;
}

export interface UpdateBankData {
  name?: string;
  accountNumber?: string;
  accountTypeId?: string;
  previousBalance?: number;
  finalBalance?: number;
  updatedBy: string;
}

export interface FindBanksOptions {
  activeOnly: boolean;
  search?: string;
}

export interface BankRepository {
  findAll(options: FindBanksOptions): Promise<Bank[]>;
  findById(id: string): Promise<Bank | null>;
  findByActiveNameAndAccountNumber(
    name: string,
    accountNumber: string,
  ): Promise<Bank | null>;
  create(data: CreateBankData): Promise<Bank>;
  update(id: string, data: UpdateBankData): Promise<Bank>;
  deactivate(id: string): Promise<void>;
}
