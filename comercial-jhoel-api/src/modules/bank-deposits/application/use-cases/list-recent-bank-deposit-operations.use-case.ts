import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import {
  BankDepositOperationSummaryOutput,
  toBankDepositOperationSummaryOutput,
} from '../dtos/bank-deposit-output';

/** Fijo — la tarjeta muestra exactamente las últimas 10; el cliente no puede pedir más. */
export const RECENT_BANK_DEPOSIT_OPERATIONS_LIMIT = 10;

/**
 * "Últimas transacciones" de Transaccionar: las 10 operaciones registradas
 * más recientes (más reciente primero, `id` como desempate estable),
 * limitadas en SQL. Una operación = una fila con su `totalAmount` y su
 * `transactionCount` — nunca se multiplica por las transacciones
 * distribuidas. Las anuladas se incluyen marcadas (`isVoided`), misma
 * convención que el listado del reporte; los totales nunca las suman.
 */
@Injectable()
export class ListRecentBankDepositOperationsUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositOperationSummaryOutput[]> {
    const operations = await this.bankDepositRepository.findRecent(
      RECENT_BANK_DEPOSIT_OPERATIONS_LIMIT,
    );
    return operations.map((operation) =>
      toBankDepositOperationSummaryOutput(operation),
    );
  }
}
