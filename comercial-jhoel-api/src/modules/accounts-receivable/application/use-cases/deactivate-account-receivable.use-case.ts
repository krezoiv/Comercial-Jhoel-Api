import { Inject, Injectable } from '@nestjs/common';
import { ACCOUNT_RECEIVABLE_REPOSITORY } from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import { AccountReceivableNotFoundError } from '../../domain/errors/account-receivable-not-found.error';
import {
  portfolioRecordError,
  requireChangeReason,
} from '../../../../shared/domain/portfolio-record';

export interface DeactivateAccountReceivableInput {
  /** Mandatory (≥5): goes to the record history and to the Caja reversal. */
  reason: string;
  userId: string;
}

/**
 * Soft void only — DELETE /accounts-receivable/:id never removes the row.
 * When the record moved Caja, the database reverses that movement (linked to
 * the original, with this reason and user) in the same transaction; a record
 * paid by bank or registered before Control de Efectivo leaves Caja alone.
 * A second void is rejected (`PORTFOLIO_RECORD_ALREADY_VOIDED`), never
 * reversed twice.
 */
@Injectable()
export class DeactivateAccountReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(
    id: string,
    input: DeactivateAccountReceivableInput,
  ): Promise<void> {
    const reason = requireChangeReason(input.reason);
    const record = await this.accountReceivableRepository.findById(id);
    if (!record) {
      throw new AccountReceivableNotFoundError();
    }
    if (!record.isActive) {
      throw portfolioRecordError('PORTFOLIO_RECORD_ALREADY_VOIDED');
    }
    await this.accountReceivableRepository.deactivate(id, reason, input.userId);
  }
}
