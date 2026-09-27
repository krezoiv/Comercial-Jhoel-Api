import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { BankMovementType } from '../../domain/entities/bank-account-movement.entity';
import { InvalidBankMovementDateRangeError } from '../../domain/errors/bank-movement.errors';
import { PaginatedBankMovementsOutput } from '../dtos/bank-movement-output';

export interface ListBankMovementsInput {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  movementType?: BankMovementType;
  userId?: string;
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 50;

/** Historial de movimientos de saldo, filtrable por fecha de negocio, cuenta, tipo y usuario. */
@Injectable()
export class ListBankMovementsUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(
    input: ListBankMovementsInput,
  ): Promise<PaginatedBankMovementsOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidBankMovementDateRangeError();
    }
    return this.bankMovementRepository.findMovements(
      {
        startDate: input.startDate,
        endDate: input.endDate,
        bankId: input.bankId,
        movementType: input.movementType,
        userId: input.userId,
      },
      input.page ?? 1,
      input.limit ?? DEFAULT_LIMIT,
    );
  }
}
