import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';

export interface AccountReceivableActiveBalanceOutput {
  totalAmount: number;
  recordCount: number;
}

/**
 * Backs the plain list screen's "Saldo total" tile — always scoped to
 * `isActive: true` only, independent of whatever search/date/client
 * filters the list itself currently has applied (the user asked for the
 * active-accounts total specifically, not a filtered one). Reuses the same
 * signed-sum `getReportSummary()` aggregate Cuadre de Agentes and
 * Reportería already depend on — never a client-side sum over one fetched
 * page, which would silently undercount whatever didn't fit the page.
 */
@Injectable()
export class GetAccountReceivableActiveBalanceUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(): Promise<AccountReceivableActiveBalanceOutput> {
    return this.accountReceivableRepository.getReportSummary({
      isActive: true,
    });
  }
}
