import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { AccountReceivableNotFoundError } from '../../domain/errors/account-receivable-not-found.error';
import type { PortfolioRecordTrace } from '../../../../shared/domain/portfolio-record';

/**
 * How one record relates to the physical cash: its payment method, whether it
 * is tracked in the Kardex (records registered before Control de Efectivo are
 * not), the effect it must have, its Kardex movements (original, reversals,
 * re-applied effect) and its change history. The UI only shows it — the edit
 * and delete dialogs use it to say what will happen to Caja.
 */
@Injectable()
export class GetAccountReceivableTraceUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(id: string): Promise<PortfolioRecordTrace> {
    const trace = await this.accountReceivableRepository.getTrace(id);
    if (!trace) {
      throw new AccountReceivableNotFoundError();
    }
    return trace;
  }
}
