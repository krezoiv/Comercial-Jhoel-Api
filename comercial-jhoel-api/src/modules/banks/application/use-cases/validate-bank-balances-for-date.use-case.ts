import { Inject, Injectable } from '@nestjs/common';
import { BANK_BALANCE_REPOSITORY } from '../../domain/repositories/bank-balance.repository';
import type { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import { InvalidBankBalanceDateError } from '../../domain/errors/invalid-bank-balance.error';
import { BankBalancesValidationOutput } from '../dtos/bank-balances-validation-output';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Backs both the new `GET /banks/balances/validation` endpoint (the
 * frontend's UX pre-check for Cuadre Agentes) and the hard gate inside
 * `CloseAgentDayUseCase` — one place decides "can this date
 * be reconciled", reused by both the read-only check and the actual
 * write-time enforcement, per this ticket's own "no confiar únicamente
 * en el frontend" requirement.
 *
 * Reuses `BankBalanceRepository.findBalancesView` — the exact same
 * active-banks-plus-daily-entry query `GetBankBalancesViewUseCase`
 * already runs for the Bancos screen — rather than a second, parallel
 * "which banks are missing a balance" query.
 */
@Injectable()
export class ValidateBankBalancesForDateUseCase {
  constructor(
    @Inject(BANK_BALANCE_REPOSITORY)
    private readonly bankBalanceRepository: BankBalanceRepository,
  ) {}

  async execute(date: string): Promise<BankBalancesValidationOutput> {
    if (!date || !DATE_PATTERN.test(date)) {
      throw new InvalidBankBalanceDateError();
    }

    const rows = await this.bankBalanceRepository.findBalancesView(date);
    const missingBanks = rows
      .filter((row) => row.finalBalance === null)
      .map((row) => ({ id: row.bankId, name: row.bankName }));

    return {
      date,
      canReconcile: missingBanks.length === 0,
      totalActiveBanks: rows.length,
      banksWithBalance: rows.length - missingBanks.length,
      missingBanks,
    };
  }
}
