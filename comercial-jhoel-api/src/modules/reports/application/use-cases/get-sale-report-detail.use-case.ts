import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../../sales/domain/repositories/sale.repository';
import type { SaleRepository } from '../../../sales/domain/repositories/sale.repository';
import { SaleReportNotFoundError } from '../../domain/errors/sale-report-not-found.error';
import {
  SaleReportDetailOutput,
  toSaleReportDetailOutput,
} from '../dtos/sales-report-output';

/**
 * Reuses `SalesModule`'s own `SALE_REPOSITORY.findById` — a full sale with
 * every line item already exists there, tested and correct, so this only
 * adds the report-specific `saleNumber` folio rather than re-querying the
 * same rows a second time. Reports are admin-only (see
 * `sales-report.controller.ts`'s guard), so there's no ownership check to
 * apply the way `GetSaleByIdUseCase` needs for a `USER` account.
 */
@Injectable()
export class GetSaleReportDetailUseCase {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: SaleRepository,
  ) {}

  async execute(id: string): Promise<SaleReportDetailOutput> {
    const sale = await this.saleRepository.findById(id);
    // An OPEN sale is someone's in-progress receipt, not a completed
    // transaction — reports only ever deal with confirmed sales, same rule
    // `GET /sales` (history) already hardcodes for its own listing.
    if (!sale || sale.status !== 'CONFIRMED') {
      throw new SaleReportNotFoundError(id);
    }

    return toSaleReportDetailOutput(sale);
  }
}
