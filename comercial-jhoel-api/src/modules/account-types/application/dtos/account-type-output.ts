import { AccountType } from '../../domain/entities/account-type.entity';

export interface AccountTypeOutput {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toAccountTypeOutput(
  accountType: AccountType,
): AccountTypeOutput {
  return {
    id: accountType.id,
    name: accountType.name,
    isActive: accountType.isActive,
    createdAt: accountType.createdAt,
    updatedAt: accountType.updatedAt,
    createdBy: accountType.createdBy,
    createdByUsername: accountType.createdByUsername,
    updatedBy: accountType.updatedBy,
    updatedByUsername: accountType.updatedByUsername,
  };
}
