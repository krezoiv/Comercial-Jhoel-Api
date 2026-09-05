import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { QuotationNotFoundError } from '../../domain/errors/quotation-not-found.error';
import { QuotationAccessDeniedError } from '../../domain/errors/quotation-access-denied.error';
import { QuotationOutput, toQuotationOutput } from '../dtos/quotation-output';

export interface GetQuotationByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetQuotationByIdUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: QuotationRepository,
  ) {}

  async execute(
    id: string,
    input: GetQuotationByIdInput,
  ): Promise<QuotationOutput> {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation) {
      throw new QuotationNotFoundError(id);
    }

    if (!input.isAdmin && quotation.userId !== input.currentUserId) {
      throw new QuotationAccessDeniedError();
    }

    return toQuotationOutput(quotation);
  }
}
