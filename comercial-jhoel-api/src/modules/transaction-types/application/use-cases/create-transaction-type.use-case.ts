import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_TYPE_REPOSITORY } from '../../domain/repositories/transaction-type.repository';
import type { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import {
  TransactionTypeBalanceEffect,
  TransactionTypeCashEffect,
} from '../../domain/entities/transaction-type.entity';

/**
 * Default physical-cash effect derived from the bank effect, used when the
 * admin does not pick one explicitly (same mapping the migration
 * `CreateCashControlKardexAndCuts` used to backfill existing types).
 */
export function defaultCashEffect(
  balanceEffect: string | null | undefined,
): TransactionTypeCashEffect {
  switch (balanceEffect) {
    case 'DEPOSITO':
    case 'PAGO_GENESIS':
      return 'IN';
    case 'RETIRO':
    case 'DESEMBOLSO_GENESIS':
      return 'OUT';
    default:
      return 'NONE';
  }
}
import { TransactionTypeNameAlreadyExistsError } from '../../domain/errors/transaction-type-name-already-exists.error';
import {
  TransactionTypeOutput,
  toTransactionTypeOutput,
} from '../dtos/transaction-type-output';

export interface CreateTransactionTypeInput {
  name: string;
  icon: string;
  balanceEffect?: string | null;
  cashEffect?: string | null;
  createdBy: string;
}

@Injectable()
export class CreateTransactionTypeUseCase {
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async execute(
    input: CreateTransactionTypeInput,
  ): Promise<TransactionTypeOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing =
      await this.transactionTypeRepository.findByActiveName(name);
    if (existing) {
      throw new TransactionTypeNameAlreadyExistsError(name);
    }

    const transactionType = await this.transactionTypeRepository.create({
      name,
      icon: input.icon,
      balanceEffect: (input.balanceEffect ??
        null) as TransactionTypeBalanceEffect | null,
      cashEffect: (input.cashEffect ??
        defaultCashEffect(input.balanceEffect)) as TransactionTypeCashEffect,
      createdBy: input.createdBy,
    });
    return toTransactionTypeOutput(transactionType);
  }
}
