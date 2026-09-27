import { Inject, Injectable } from '@nestjs/common';
import { BANK_MOVEMENT_REPOSITORY } from '../../../banks/domain/repositories/bank-movement.repository';
import type {
  BankMovementRepository,
  BankTransferFilters,
  BankTransfersSummary,
  PaginatedBankTransfers,
} from '../../../banks/domain/repositories/bank-movement.repository';
import { InvalidBankMovementDateRangeError } from '../../../banks/domain/errors/bank-movement.errors';

export interface BankTransfersReportInput extends BankTransferFilters {
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 20;

function assertValidRange(input: BankTransferFilters): void {
  if (input.startDate && input.endDate && input.startDate > input.endDate) {
    throw new InvalidBankMovementDateRangeError();
  }
}

function toFilters(input: BankTransfersReportInput): BankTransferFilters {
  return {
    startDate: input.startDate,
    endDate: input.endDate,
    sourceBankId: input.sourceBankId,
    destinationBankId: input.destinationBankId,
    userId: input.userId,
    status: input.status,
  };
}

/**
 * Reporte de Transferencias Bancarias — listado paginado. Reutiliza el
 * mismo `BANK_MOVEMENT_REPOSITORY.findTransfers` que la pantalla operativa
 * de Transferencias (exportado por `BanksModule`): una sola consulta sobre
 * el ledger, nunca una tabla ni un cálculo paralelo.
 */
@Injectable()
export class GetBankTransfersReportUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(
    input: BankTransfersReportInput,
  ): Promise<PaginatedBankTransfers> {
    assertValidRange(input);
    return this.bankMovementRepository.findTransfers(
      toFilters(input),
      input.page ?? 1,
      input.limit ?? DEFAULT_LIMIT,
    );
  }
}

/** Totales (excluyen anuladas, que se cuentan aparte) y desglose por ruta origen → destino. */
@Injectable()
export class GetBankTransfersReportSummaryUseCase {
  constructor(
    @Inject(BANK_MOVEMENT_REPOSITORY)
    private readonly bankMovementRepository: BankMovementRepository,
  ) {}

  async execute(
    input: BankTransfersReportInput,
  ): Promise<BankTransfersSummary> {
    assertValidRange(input);
    return this.bankMovementRepository.getTransfersSummary(toFilters(input));
  }
}
