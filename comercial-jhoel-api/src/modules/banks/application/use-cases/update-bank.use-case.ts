import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { ACCOUNT_TYPE_REPOSITORY } from '../../../account-types/domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../../account-types/domain/repositories/account-type.repository';
import { BankNotFoundError } from '../../domain/errors/bank-not-found.error';
import { BankAlreadyExistsError } from '../../domain/errors/bank-already-exists.error';
import { InvalidAccountTypeError } from '../../domain/errors/invalid-account-type.error';
import { BankOutput, toBankOutput } from '../dtos/bank-output';

export interface UpdateBankInput {
  name?: string;
  accountNumber?: string;
  accountTypeId?: string;
  previousBalance?: number;
  finalBalance?: number;
  updatedBy: string;
}

@Injectable()
export class UpdateBankUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(ACCOUNT_TYPE_REPOSITORY)
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}

  async execute(id: string, input: UpdateBankInput): Promise<BankOutput> {
    const bank = await this.bankRepository.findById(id);
    if (!bank) {
      throw new BankNotFoundError(id);
    }

    if (input.accountTypeId) {
      const accountType = await this.accountTypeRepository.findById(
        input.accountTypeId,
      );
      if (!accountType || !accountType.isActive) {
        throw new InvalidAccountTypeError();
      }
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    const accountNumber = input.accountNumber?.trim();
    const nextName = name ?? bank.name;
    const nextAccountNumber = accountNumber ?? bank.accountNumber;

    if (
      (name || accountNumber) &&
      (nextName !== bank.name || nextAccountNumber !== bank.accountNumber)
    ) {
      const existing =
        await this.bankRepository.findByActiveNameAndAccountNumber(
          nextName,
          nextAccountNumber,
        );
      if (existing && existing.id !== id) {
        throw new BankAlreadyExistsError(nextName, nextAccountNumber);
      }
    }

    const updated = await this.bankRepository.update(id, {
      ...(name ? { name } : {}),
      ...(accountNumber ? { accountNumber } : {}),
      ...(input.accountTypeId ? { accountTypeId: input.accountTypeId } : {}),
      ...(input.previousBalance !== undefined
        ? { previousBalance: input.previousBalance }
        : {}),
      ...(input.finalBalance !== undefined
        ? { finalBalance: input.finalBalance }
        : {}),
      updatedBy: input.updatedBy,
    });

    return toBankOutput(updated);
  }
}
