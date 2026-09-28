import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../domain/repositories/bank-movement.repository';
import type { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { PaginatedBankMovementsOutput } from '../dtos/bank-movement-output';

export interface ListBankBalanceCreditsInput {
  startDate?: string;
  endDate?: string;
  bankId?: string;
  page?: number;
  limit?: number;
}

/** Historial de acreditaciones — el mismo ledger filtrado por `ACREDITACION_SALDO` (vigentes y anuladas). */
@Injectable()
export class ListBankBalanceCreditsUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  execute(input: ListBankBalanceCreditsInput): Promise<PaginatedBankMovementsOutput> {
    return this.bankMovementRepository.findMovements(
      {
        startDate: input.startDate,
        endDate: input.endDate,
        bankId: input.bankId,
        movementType: 'ACREDITACION_SALDO',
      },
      input.page ?? 1,
      input.limit ?? 10,
    );
  }
}
