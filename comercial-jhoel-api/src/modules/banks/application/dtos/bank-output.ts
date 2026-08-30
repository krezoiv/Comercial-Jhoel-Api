import { Bank } from '../../domain/entities/bank.entity';

export interface BankOutput {
  id: string;
  name: string;
  accountNumber: string;
  accountTypeId: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toBankOutput(bank: Bank): BankOutput {
  return {
    id: bank.id,
    name: bank.name,
    accountNumber: bank.accountNumber,
    accountTypeId: bank.accountTypeId,
    accountTypeName: bank.accountTypeName,
    previousBalance: bank.previousBalance,
    finalBalance: bank.finalBalance,
    isActive: bank.isActive,
    createdAt: bank.createdAt,
    updatedAt: bank.updatedAt,
    createdBy: bank.createdBy,
    createdByUsername: bank.createdByUsername,
    updatedBy: bank.updatedBy,
    updatedByUsername: bank.updatedByUsername,
  };
}
