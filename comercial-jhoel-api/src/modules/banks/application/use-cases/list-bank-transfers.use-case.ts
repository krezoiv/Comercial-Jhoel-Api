import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { InvalidBankMovementDateRangeError } from '../../domain/errors/bank-movement.errors';
import { BankTransferOutput } from '../dtos/bank-movement-output';

export interface ListBankTransfersInput {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  limit?: number;
}

const DEFAULT_LIMIT = 50;

@Injectable()
export class ListBankTransfersUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(input: ListBankTransfersInput): Promise<BankTransferOutput[]> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankMovementDateRangeError();
    }
    return this.bankMovementRepository.findTransfers(
      {
        startDate: input.startDate,
        endDate: input.endDate,
        bankId: input.bankId,
      },
      input.limit ?? DEFAULT_LIMIT,
    );
  }
}
