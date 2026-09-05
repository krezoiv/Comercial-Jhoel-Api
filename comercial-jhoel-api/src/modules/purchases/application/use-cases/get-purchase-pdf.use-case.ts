import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAccessDeniedError } from '../../domain/errors/purchase-access-denied.error';
import { SUPPLIER_REPOSITORY } from '../../../suppliers/domain/repositories/supplier.repository';
import type { SupplierRepository } from '../../../suppliers/domain/repositories/supplier.repository';
import { COMPANY_SETTINGS_REPOSITORY } from '../../../company-settings/domain/repositories/company-settings.repository';
import type { CompanySettingsRepository } from '../../../company-settings/domain/repositories/company-settings.repository';
import { buildPurchasePdf } from '../../infrastructure/pdf/purchase-pdf.builder';

export interface GetPurchasePdfInput {
  currentUserId: string;
  isAdmin: boolean;
}

/**
 * Reconstructs the purchase's invoice PDF purely from already-persisted data
 * — never re-runs `confirm_purchase` or touches inventory. Same ownership
 * rule as `GetPurchaseByIdUseCase`. Unlike Sales, purchases have no `OPEN`
 * draft concept — every row is already a completed, confirmed purchase — so
 * there is no draft-rejection branch here.
 */
@Injectable()
export class GetPurchasePdfUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: SupplierRepository,
    @Inject(COMPANY_SETTINGS_REPOSITORY)
    private readonly companySettingsRepository: CompanySettingsRepository,
  ) {}

  async execute(id: string, input: GetPurchasePdfInput): Promise<Buffer> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new PurchaseNotFoundError(id);
    }

    if (!input.isAdmin && purchase.userId !== input.currentUserId) {
      throw new PurchaseAccessDeniedError();
    }

    const [supplier, company] = await Promise.all([
      this.supplierRepository.findById(purchase.supplierId),
      this.companySettingsRepository.get(),
    ]);

    return buildPurchasePdf({
      company: {
        businessName: company.businessName,
        address: company.address,
        phone: company.phone,
        email: company.email,
        taxId: company.taxId,
        logoBase64: company.logoBase64,
      },
      purchaseNumber: `C-${purchase.id.slice(0, 8).toUpperCase()}`,
      purchaseDate: purchase.purchaseDate,
      username: purchase.username,
      supplier: {
        name: purchase.supplierName,
        phone: supplier?.phone ?? null,
        address: supplier?.address ?? null,
        taxId: supplier?.taxId ?? null,
      },
      paymentType: purchase.paymentType,
      paymentDueDate: purchase.paymentDueDate,
      items: purchase.items.map((item) => ({
        productName: item.productName,
        presentationName: 'Unidad',
        quantity: item.quantity,
        costPrice: item.costPrice,
        total: item.total,
      })),
      total: purchase.total,
    });
  }
}
