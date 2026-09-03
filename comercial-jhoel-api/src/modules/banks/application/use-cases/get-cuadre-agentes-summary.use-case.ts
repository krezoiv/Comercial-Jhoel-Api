import { Inject, Injectable } from '@nestjs/common';
import { BANK_REPOSITORY } from '../../domain/repositories/bank.repository';
import type { BankRepository } from '../../domain/repositories/bank.repository';
import { ASSET_REPOSITORY } from '../../../assets/domain/repositories/asset.repository';
import type { AssetRepository } from '../../../assets/domain/repositories/asset.repository';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../../accounts-receivable/domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../../accounts-receivable/domain/repositories/account-receivable.repository';
import {
  BankBalanceCalculationType,
  CuadreAgentesSummaryOutput,
} from '../dtos/cuadre-agentes-summary-output';

/**
 * `account_types.name` is admin-editable free text (Sistema → Tipos de
 * Cuenta), not a fixed enum — confirmed directly against this database
 * before writing this, not assumed: the real seeded rows are `"Ahorros"`,
 * `"Monetaria"`, and `"Linea Crédito"` (no "de", a different accent
 * placement than the ticket's own "Línea de Crédito" example — exactly
 * the kind of variation the ticket warned to check for instead of
 * guessing). Matching on a normalized (accent-stripped, lower-cased)
 * substring of "credito" is what makes this robust to that spelling and
 * to "Línea de Crédito"/"Linea de Credito"/a bare "Crédito" alike, without
 * depending on today's specific row IDs — a stable numeric/enum
 * discriminator would be preferable, but this table has none, so the name
 * is the only signal `account_types` actually carries.
 */
function isCreditLineAccountType(accountTypeName: string): boolean {
  const normalized = accountTypeName
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .toLowerCase()
    .trim();
  return normalized.includes('credito');
}

/**
 * "Cuadre Agentes" (primera etapa) — a single read-only aggregate spanning
 * three otherwise-independent modules (Bancos, Activos, Cuentas por
 * Cobrar), the same cross-module reuse pattern
 * `GetAssetsReceivablesReportUseCase` already established: inject the
 * other modules' own repositories rather than re-querying their tables
 * directly, so there is exactly one place that knows how to compute each
 * total (`AssetRepository`/`AccountReceivableRepository.getReportSummary`
 * are the exact same real-SQL-aggregate methods Reportería already uses —
 * see that module's own "never sum in memory over one page" note).
 *
 * `finalBalance` here is each active bank's own `banks.final_balance`
 * column — the static reference value Sistema → Bancos stores (see that
 * module's docs: it seeds "saldo anterior" for a bank's very first cuadre
 * in Agentes Bancarios → Bancos, not a live daily figure). This first
 * stage's ticket explicitly asks for exactly this column; wiring this
 * summary to the *live* daily cuadre (`bank_balances`) instead is a
 * deliberately out-of-scope later stage, not an oversight.
 */
@Injectable()
export class GetCuadreAgentesSummaryUseCase {
  constructor(
    @Inject(BANK_REPOSITORY)
    private readonly bankRepository: BankRepository,
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(): Promise<CuadreAgentesSummaryOutput> {
    const [banks, assetsSummary, receivablesSummary] = await Promise.all([
      this.bankRepository.findAll({ activeOnly: true }),
      this.assetRepository.getReportSummary({ isActive: true }),
      this.accountReceivableRepository.getReportSummary({ isActive: true }),
    ]);

    const bankItems = banks.map((bank) => {
      const calculationType: BankBalanceCalculationType =
        isCreditLineAccountType(bank.accountTypeName) ? 'subtract' : 'sum';
      return {
        id: bank.id,
        name: bank.name,
        accountTypeId: bank.accountTypeId,
        accountTypeName: bank.accountTypeName,
        finalBalance: bank.finalBalance,
        calculationType,
      };
    });

    // Ahorro/Monetaria (anything not identified as a línea de crédito) add;
    // línea de crédito subtracts — `finalBalance` itself is never negated
    // or rewritten, only how it folds into these two running totals.
    const totalPositiveAccounts = bankItems
      .filter((bank) => bank.calculationType === 'sum')
      .reduce((sum, bank) => sum + bank.finalBalance, 0);
    const totalCreditLines = bankItems
      .filter((bank) => bank.calculationType === 'subtract')
      .reduce((sum, bank) => sum + bank.finalBalance, 0);

    return {
      banks: bankItems,
      totalBanks: totalPositiveAccounts - totalCreditLines,
      totalPositiveAccounts,
      totalCreditLines,
      totalAssets: assetsSummary.totalAmount,
      totalAccountsReceivable: receivablesSummary.totalAmount,
    };
  }
}
