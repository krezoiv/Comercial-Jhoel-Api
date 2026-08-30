import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../../purchases/domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../../purchases/domain/repositories/purchase.repository';
import { PurchaseReportNotFoundError } from '../../domain/errors/purchase-report-not-found.error';
import {
  PurchaseReportDetailOutput,
  toPurchaseReportDetailOutput,
} from '../dtos/purchases-report-output';

/**
 * Reuses `PurchasesModule`'s own `PURCHASE_REPOSITORY.findById` — same
 * reasoning as `GetSaleReportDetailUseCase`: avoids re-querying rows that
 * already have a correct, tested fetch path, and adds only the report's
 * `purchaseNumber` folio. Purchases has no draft/status concept (unlike
 * Sales), so every persisted purchase is already a completed one — no extra
 * status check needed here.
 */
@Injectable()
export class GetPurchaseReportDetailUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(id: string): Promise<PurchaseReportDetailOutput> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new PurchaseReportNotFoundError(id);
    }

    return toPurchaseReportDetailOutput(purchase);
  }
}
