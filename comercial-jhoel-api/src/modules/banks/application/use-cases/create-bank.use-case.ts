import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { ACCOUNT_TYPE_REPOSITORY } from '../../../account-types/domain/repositories/account-type.repository';
import type { AccountTypeRepository } from '../../../account-types/domain/repositories/account-type.repository';
import { BankAlreadyExistsError } from '../../domain/errors/bank-already-exists.error';
import { InvalidAccountTypeError } from '../../domain/errors/invalid-account-type.error';
import { BankOutput, toBankOutput } from '../dtos/bank-output';
import { BankSpecialAccount } from '../../domain/entities/bank-account-movement.entity';
import {
  CreditLineNoAvailableError,
  CreditLinePaymentExceededError,
  InsufficientBankBalanceError,
} from '../../domain/errors/bank-movement.errors';

export interface CreateBankInput {
  name: string;
  accountNumber: string;
  accountTypeId: string;
  previousBalance?: number;
  finalBalance?: number;
  specialAccount?: string | null;
  maxBalance?: number | null;
  availableInTransaccionar?: boolean;
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

    const specialAccount = (input.specialAccount ??
      null) as BankSpecialAccount | null;
    const finalBalance = input.finalBalance ?? 0;
    if (specialAccount === 'BI_CLUB') {
      // Línea de crédito: saldo = −disponible, entre -límite (todo
      // disponible) y Q0.00 (agotada).
      if (finalBalance > 0) {
        throw new CreditLineNoAvailableError('AJUSTE_MANUAL');
      }
      if (finalBalance < -(input.maxBalance ?? 0)) {
        throw new CreditLinePaymentExceededError('AJUSTE_MANUAL');
      }
    } else if (finalBalance < 0 && specialAccount !== 'GENESIS') {
      throw new InsufficientBankBalanceError('AJUSTE_MANUAL');
    }

    const bank = await this.bankRepository.create({
      name,
      accountNumber,
      accountTypeId: input.accountTypeId,
      previousBalance: input.previousBalance ?? 0,
      finalBalance,
      specialAccount,
      maxBalance: input.maxBalance ?? null,
      availableInTransaccionar: input.availableInTransaccionar ?? true,
      createdBy: input.createdBy,
    });

    return toBankOutput(bank);
  }
}
