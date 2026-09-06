import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { DAY_OPENING_REPOSITORY } from '../../../banks/domain/repositories/day-opening.repository';
import type { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { BankDepositDayNotOpenedError } from '../../domain/errors/bank-deposit-day-not-opened.error';
import { BankDepositDayAlreadyClosedError } from '../../domain/errors/bank-deposit-day-already-closed.error';
import {
  BankDepositOperationOutput,
  toBankDepositOperationOutput,
} from '../dtos/bank-deposit-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface RegisterBankDepositOperationCashDetailInput {
  denomination: number;
  quantity: number;
}

export interface RegisterBankDepositOperationInput {
  transactionBankId: string;
  transactionTypeId: string;
  totalAmount: number;
  cashDetails: RegisterBankDepositOperationCashDetailInput[];
  transactionAmounts: number[];
  userId: string;
  clientName?: string | null;
  /** "Vuelto" — omitted/`0` means no vuelto. `register_bank_deposit_operation` recomputes/validates this against the actual cash total server-side regardless of what's sent here. */
  changeGiven?: number;
}

/**
 * Registers one "Transaccionar" deposit. Reuses Banks' own día-abierto/cerrado
 * cycle (`DAY_OPENING_REPOSITORY`, exported by `BanksModule`) instead of a
 * parallel one — the ticket explicitly asks to reuse the existing mechanism,
 * and a closed day blocks this the same way it blocks Cuadre de Agentes.
 * The actual cuadre validation (cash total / transactions total must both
 * equal the total amount exactly) happens inside `register_bank_deposit_operation`
 * itself — this use case never trusts or recomputes those totals, it only
 * gates on the business-day cycle before delegating to the repository.
 * Operation date is always "today" (server-local) — no backdating in v1.
 */
@Injectable()
export class RegisterBankDepositOperationUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
    @Inject(DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: DayOpeningRepository,
  ) {}

  async execute(
    input: RegisterBankDepositOperationInput,
  ): Promise<BankDepositOperationOutput> {
    const operationDate = todayIsoDate();

    const dayOpening =
      await this.dayOpeningRepository.findByDate(operationDate);
    if (!dayOpening) {
      throw new BankDepositDayNotOpenedError(operationDate);
    }
    if (dayOpening.isClosed) {
      throw new BankDepositDayAlreadyClosedError(operationDate);
    }

    const operation = await this.bankDepositRepository.registerOperation({
      transactionBankId: input.transactionBankId,
      transactionTypeId: input.transactionTypeId,
      totalAmount: input.totalAmount,
      operationDate,
      cashDetails: input.cashDetails,
      transactionAmounts: input.transactionAmounts,
      userId: input.userId,
      clientName: input.clientName ?? null,
      changeGiven: input.changeGiven ?? 0,
    });

    return toBankDepositOperationOutput(operation);
  }
}
