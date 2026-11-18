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
 * Anular (status CANCELADA) — never a physical delete/edit. Runs through
 * `change_quotation_status('CANCELAR')`, which locks the row and refuses a
 * VENDIDA quotation (its sale must be voided in Ventas first).
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
    if (quotation.status === 'CANCELADA') {
      throw new QuotationAlreadyVoidedError(input.id);
    }

    const voided = await this.quotationRepository.changeStatus(
      input.id,
      'CANCELAR',
      input.voidedBy,
      input.reason,
    );
    return toQuotationOutput(voided);
  }
}
