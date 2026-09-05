import { Inject, Injectable } from '@nestjs/common';
import { BANK_DEPOSIT_REPOSITORY } from '../../domain/repositories/bank-deposit.repository';
import type { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';

export interface BankDepositMonthlyCountOutput {
  count: number;
  month: string;
}

/** Local-time `yyyy-MM-dd`, no UTC-offset dance — same technique every other date-driven use case in this codebase already uses. */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Backs the "Bancos" tile on the Resumen dashboard — "Total de Transacciones"
 * for the current calendar month, resetting automatically the moment the
 * server's own clock rolls into a new month (no stored counter, no reset
 * job: `startDate` is simply recomputed as "the 1st of whatever month it is
 * right now" on every call). Reuses `getReportSummary()`'s own
 * `operationCount` — already excludes voided operations, same reasoning as
 * "Reporte de Transacciones"' own summary tiles — rather than a second,
 * duplicated count query.
 *
 * Deliberately NOT admin-gated (no `@Roles` on its controller route) —
 * unlike `GetBankDepositsReportSummaryUseCase`, which powers a full
 * management report. Resumen is the first page every authenticated
 * account sees, `USER`-role included, so this only ever returns one
 * number, never the filterable/by-bank breakdown a `USER` account
 * shouldn't see.
 */
@Injectable()
export class GetBankDepositMonthlyCountUseCase {
  constructor(
    @Inject(BANK_DEPOSIT_REPOSITORY)
    private readonly bankDepositRepository: BankDepositRepository,
  ) {}

  async execute(): Promise<BankDepositMonthlyCountOutput> {
    const now = new Date();
    const startDate = toIsoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const endDate = toIsoDate(now);

    const summary = await this.bankDepositRepository.getReportSummary({
      startDate,
      endDate,
    });

    return {
      count: summary.operationCount,
      month: startDate.slice(0, 7),
    };
  }
}
