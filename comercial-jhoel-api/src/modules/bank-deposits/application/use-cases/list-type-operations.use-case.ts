import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { InvalidBankDepositDateRangeError } from '../../domain/errors/invalid-bank-deposit-date-range.error';
import type {
  OperationModality,
  TypeEntryStatus,
  TypeOperationEntry,
  TypeOperationSummary,
} from '../../domain/operation-modality';

export interface ListTypeOperationsInput {
  transactionTypeId: string;
  modality?: OperationModality;
  startDate?: string;
  endDate?: string;
  status?: TypeEntryStatus;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListTypeOperationsOutput {
  items: TypeOperationEntry[];
  total: number;
  page: number;
  limit: number;
  summary: TypeOperationSummary;
}

/**
 * "Operaciones de <tipo>" inside Transaccionar (Pago Varios, Préstamos
 * Génesis...): individual operations and payment groups of that type in one
 * list, each marked with its modality. The deliveries of a group are not
 * listed as individual operations — the group row stands for them — so a group
 * payment is never mistaken for an independent one. Read-only; open to every
 * Transaccionar user, like the recent-operations card.
 */
@Injectable()
export class ListTypeOperationsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(
    input: ListTypeOperationsInput,
  ): Promise<ListTypeOperationsOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankDepositDateRangeError();
    }
    const page = Math.max(input.page ?? 1, 1);
    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const result = await this.bankDepositRepository.findTypeEntries({
      transactionTypeId: input.transactionTypeId,
      modality: input.modality,
      startDate: input.startDate,
      endDate: input.endDate,
      status: input.status,
      userId: input.userId,
      search: input.search?.trim() || undefined,
      page,
      limit,
    });
    return { ...result, page, limit };
  }
}
