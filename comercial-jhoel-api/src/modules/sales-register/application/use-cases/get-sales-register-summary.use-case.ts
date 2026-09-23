import { Inject, Injectable } from '@nestjs/common';
import { SALES_REGISTER_REPOSITORY } from '../../domain/repositories/sales-register.repository';
import type { SalesRegisterRepository } from '../../domain/repositories/sales-register.repository';
import { InvalidSalesRegisterDateError } from '../../domain/errors/invalid-sales-register-date.error';
import { SalesRegisterSummaryOutput } from '../dtos/sales-register-summary-output';

export interface GetSalesRegisterSummaryInput {
  /** `yyyy-MM-dd` — defaults to today (server-local, `America/Guatemala`) when omitted. */
  date?: string;
}

/**
 * `yyyy-MM-dd` in local server time — this module's own copy, matching the
 * per-module convention every date-driven feature in this codebase already
 * follows (Recargas/Bank-deposits/Banks/Alerts each own a tiny copy rather
 * than sharing one utility). The API process runs with
 * `TZ=America/Guatemala` (see `docker-compose.yml`/migration
 * `1759100000000-SetDatabaseTimezone`), so `Date`'s own local getters
 * already reflect the correct Guatemala calendar day.
 */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayIsoDate(): string {
  return toIsoDate(new Date());
}

/** One calendar day past today — same grace window Recargas' own `maxAllowedOperationDate()` uses to absorb client/server clock skew around "today" without permitting genuine future-dating. */
function maxAllowedDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toIsoDate(date);
}

/**
 * "Gestión de Caja de Ventas" — a live, read-only view over the EXISTING
 * `sales`/`sale_details` tables, grouped by `business_id` (the product's
 * "línea de negocio" this app already has — see `businesses`/
 * `CreateBusinessesTable`), for one business day. Never a second sales
 * system: this use case writes nothing, and reuses exactly the same
 * `status = 'CONFIRMED' AND is_voided = false` filter every other reader of
 * `sales` (Reports, Dashboard, `getDailySalesTotals`) already applies — a
 * voided sale or an in-progress `OPEN` draft never contributes here either.
 */
@Injectable()
export class GetSalesRegisterSummaryUseCase {
  constructor(
    @Inject(SALES_REGISTER_REPOSITORY)
    private readonly repository: SalesRegisterRepository,
  ) {}

  async execute(
    input: GetSalesRegisterSummaryInput = {},
  ): Promise<SalesRegisterSummaryOutput> {
    const date = input.date ?? todayIsoDate();
    if (date > maxAllowedDate()) {
      throw new InvalidSalesRegisterDateError();
    }

    const [year, month, day] = date.split('-').map(Number);
    const start = new Date(year, month - 1, day, 0, 0, 0, 0);
    const end = new Date(year, month - 1, day, 23, 59, 59, 999);

    const raw = await this.repository.getDailyData({ start, end });

    const businesses = raw.businessTotals.map((business) => {
      const products = raw.productRows
        .filter((row) => row.businessId === business.businessId)
        .map((row) => ({
          productId: row.productId,
          productName: row.productName,
          sku: row.sku,
          quantitySold: row.quantitySold,
          totalRevenue: row.totalRevenue,
        }));

      return {
        businessId: business.businessId,
        businessName: business.businessName,
        totalAmount: business.totalAmount,
        salesCount: business.salesCount,
        productsCount: business.productsCount,
        topProduct: products[0]
          ? { productName: products[0].productName, quantitySold: products[0].quantitySold }
          : null,
        products,
      };
    });

    return {
      date,
      totalAmount: raw.overall.totalAmount,
      salesCount: raw.overall.salesCount,
      productsCount: businesses.reduce((sum, b) => sum + b.productsCount, 0),
      businessesActive: businesses.length,
      businesses,
    };
  }
}
