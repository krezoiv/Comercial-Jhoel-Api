import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { QuotationNotFoundError } from '../../domain/errors/quotation-not-found.error';
import { QuotationAccessDeniedError } from '../../domain/errors/quotation-access-denied.error';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { buildQuotationPdf } from '../../infrastructure/pdf/quotation-pdf.builder';

export interface GetQuotationPdfInput {
  currentUserId: string;
  isAdmin: boolean;
}

/**
 * Reconstructs the quotation's PDF purely from already-persisted,
 * historicized data — never re-runs `create_quotation`, never re-reads the
 * product's *current* price, never touches inventory. Same ownership rule
 * as `GetQuotationByIdUseCase`. A quotation has no draft concept (created in
 * one shot), so there's no draft-rejection branch.
 */
@Injectable()
export class GetQuotationPdfUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: QuotationRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(id: string, input: GetQuotationPdfInput): Promise<Buffer> {
    const quotation = await this.quotationRepository.findById(id);
    if (!quotation) {
      throw new QuotationNotFoundError(id);
    }

    if (!input.isAdmin && quotation.userId !== input.currentUserId) {
      throw new QuotationAccessDeniedError();
    }

    const company = await this.companySettingsRepository.get();

    return buildQuotationPdf({
      company: {
        businessName: company.businessName,
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        logoBase64: company.logoBase64,
      },
      quotationNumber: quotation.quotationNumber,
      quotationDate: quotation.quotationDate,
      expirationDate: quotation.expirationDate,
      clientName: quotation.clientName,
      items: quotation.items.map((item) => ({
        productName: item.productName,
        presentationName: item.presentationName ?? 'Unidad',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total,
      })),
      subtotal: quotation.subtotal,
      discount: quotation.discount,
      total: quotation.total,
      observations: quotation.observations,
      commercialTerms: quotation.commercialTerms,
    });
  }
}
