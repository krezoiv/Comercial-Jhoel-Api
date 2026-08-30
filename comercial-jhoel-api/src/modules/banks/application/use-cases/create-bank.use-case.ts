import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { ACCOUNT_TYPE_REPOSITORY } from '../../../account-types/domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../../account-types/domain/repositories/account-type.repository';
import { BankAlreadyExistsError } from '../../domain/errors/bank-already-exists.error';
import { InvalidAccountTypeError } from '../../domain/errors/invalid-account-type.error';
import { BankOutput, toBankOutput } from '../dtos/bank-output';

export interface CreateBankInput {
  name: string;
  accountNumber: string;
  accountTypeId: string;
  previousBalance?: number;
  finalBalance?: number;
  createdBy: string;
}

@Injectable()
export class CreateBankUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(input: CreateBankInput): Promise<BankOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');
    // Never trimmed away to nothing and never touched numerically — an
    // account number is an identifier (leading zeros/dashes are
    // significant), not a value to compute with.
    const accountNumber = input.accountNumber.trim();

    const accountType = await this.accountTypeRepository.findById(
      input.accountTypeId,
    );
    if (!accountType || !accountType.isActive) {
      throw new InvalidAccountTypeError();
    }

    const existing = await this.bankRepository.findByActiveNameAndAccountNumber(
      name,
      accountNumber,
    );
    if (existing) {
      throw new BankAlreadyExistsError(name, accountNumber);
    }

    const bank = await this.bankRepository.create({
      name,
      accountNumber,
      accountTypeId: input.accountTypeId,
      previousBalance: input.previousBalance ?? 0,
      finalBalance: input.finalBalance ?? 0,
      createdBy: input.createdBy,
    });

    return toBankOutput(bank);
  }
}
