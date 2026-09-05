import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleNotFoundError } from '../../domain/errors/sale-not-found.error';
import { SaleAccessDeniedError } from '../../domain/errors/sale-access-denied.error';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { buildSalePdf } from '../../infrastructure/pdf/sale-pdf.builder';

export interface GetSalePdfInput {
  currentUserId: string;
  isAdmin: boolean;
}

/**
 * Reconstructs the sale's PDF purely from already-persisted data — never
 * re-runs `confirm_open_sale`/`confirm_sale` or touches inventory. Same
 * ownership rule as `GetSaleByIdUseCase` (a non-admin only gets their own
 * sale's PDF); additionally rejects an `OPEN` draft the same way
 * `GetSaleReportDetailUseCase` does — a PDF only makes sense for a
 * completed sale.
 */
@Injectable()
export class GetSalePdfUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(id: string, input: GetSalePdfInput): Promise<Buffer> {
    const sale = await this.saleRepository.findById(id);
    if (!sale || sale.status !== 'CONFIRMED') {
      throw new SaleNotFoundError(id);
    }

    if (!input.isAdmin && sale.userId !== input.currentUserId) {
      throw new SaleAccessDeniedError();
    }

    const company = await this.companySettingsRepository.get();

    return buildSalePdf({
      company: {
        businessName: company.businessName,
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        logoBase64: company.logoBase64,
      },
      saleNumber: `V-${sale.id.slice(0, 8).toUpperCase()}`,
      saleDate: sale.saleDate,
      username: sale.username,
      clientName: sale.clientName,
      items: sale.items.map((item) => ({
        productName: item.productName,
        presentationName: 'Unidad',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      total: sale.total,
    });
  }
}
