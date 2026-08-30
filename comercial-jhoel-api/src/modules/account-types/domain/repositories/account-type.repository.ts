import { AccountType } from '../entities/account-type.entity';

export const ACCOUNT_TYPE_REPOSITORY = Symbol('ACCOUNT_TYPE_REPOSITORY');

export interface CreateAccountTypeData {
  name: string;
  createdBy: string;
}

export interface UpdateAccountTypeData {
  name?: string;
  updatedBy: string;
}

export interface FindAccountTypesOptions {
  activeOnly: boolean;
}

export interface AccountTypeRepository {
  findAll(options: FindAccountTypesOptions): Promise<AccountType[]>;
  findById(id: string): Promise<AccountType | null>;
  findByActiveName(name: string): Promise<AccountType | null>;
  create(data: CreateAccountTypeData): Promise<AccountType>;
  update(id: string, data: UpdateAccountTypeData): Promise<AccountType>;
  deactivate(id: string): Promise<void>;
}
