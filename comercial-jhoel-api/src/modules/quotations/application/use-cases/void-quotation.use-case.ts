import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { QuotationNotFoundError } from '../../domain/errors/quotation-not-found.error';
import { QuotationAlreadyVoidedError } from '../../domain/errors/quotation-already-voided.error';
import { QuotationOutput, toQuotationOutput } from '../dtos/quotation-output';

export interface VoidQuotationInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * The correction path for a mistaken Cotización — never an edit, never a
 * physical delete. Same shape as `VoidTicketUseCase`/
 * `VoidBankDepositOperationUseCase`. Admin-only (enforced at the controller
 * via `@Roles`). `'ANULADA'` is terminal — voiding an already-voided
 * quotation is rejected, same as re-voiding a ticket.
 */
@Injectable()
export class VoidQuotationUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: QuotationRepository,
  ) {}

  async execute(input: VoidQuotationInput): Promise<QuotationOutput> {
    const quotation = await this.quotationRepository.findById(input.id);
    if (!quotation) {
      throw new QuotationNotFoundError(input.id);
    }
    if (quotation.status === 'ANULADA') {
      throw new QuotationAlreadyVoidedError(input.id);
    }

    const voided = await this.quotationRepository.voidQuotation(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toQuotationOutput(voided);
  }
}
