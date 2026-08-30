import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { SaleOrmEntity } from '../../../sales/infrastructure/persistence/sale.orm-entity';
import { SaleDetailOrmEntity } from '../../../sales/infrastructure/persistence/sale-detail.orm-entity';
import {
  PaginatedReportResult,
  ReportSortField,
  SalesByProductRow,
  SalesReportFilters,
  SalesReportRepository,
  SalesReportRow,
  SalesReportSummary,
  SortDirection,
} from '../../domain/repositories/sales-report.repository';

const SORT_COLUMN: Record<ReportSortField, string> = {
  date: 'sale.saleDate',
  total: 'sale.total',
};

@Injectable()
export class TypeOrmSalesReportRepository implements SalesReportRepository {
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly saleRepository: Repository<SaleOrmEntity>,
    @InjectRepository(SaleDetailOrmEntity)
    private readonly saleDetailRepository: Repository<SaleDetailOrmEntity>,
  ) {}

  async findAll(
    filters: SalesReportFilters,
    page: number,
    limit: number,
    sortBy: ReportSortField,
    sortDirection: SortDirection,
  ): Promise<PaginatedReportResult<SalesReportRow>> {
    const qb = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoin('sale.user', 'user')
      .where('sale.status = :status', { status: 'CONFIRMED' });

    this.applyDateUserFilters(qb, filters);
    this.applyProductExistsFilter(qb, filters);

    const total = await qb.clone().getCount();

    // A scalar correlated subquery (not a join) for the item count —
    // joining `sale.items` here would fan out one row per line and corrupt
    // both the pagination and this very `COUNT`. Same lesson already
    // documented on `TypeOrmSaleRepository.findAll` for the plain sales
    // history listing. Raw select + `getRawMany()` throughout, rather than
    // `getManyAndCount()`, since this TypeORM version has no
    // relation-count-and-map helper to hydrate a computed column onto the
    // entity automatically.
    qb.select('sale.id', 'id')
      .addSelect('sale.saleDate', 'saleDate')
      .addSelect('sale.total', 'total')
      .addSelect('sale.userId', 'userId')
      .addSelect('user.username', 'username')
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'count')
            .from(SaleDetailOrmEntity, 'sd')
            .where('sd.saleId = sale.id'),
        'itemCount',
      )
      .orderBy(SORT_COLUMN[sortBy], sortDirection === 'asc' ? 'ASC' : 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      saleDate: Date;
      total: string;
      userId: string;
      username: string | null;
      itemCount: string;
    }>();

    return {
      items: rows.map((row) => ({
        id: row.id,
        saleNumber: `V-${row.id.slice(0, 8).toUpperCase()}`,
        saleDate: row.saleDate,
        userId: row.userId,
        username: row.username ?? '—',
        itemCount: parseInt(row.itemCount, 10),
        total: parseFloat(row.total),
      })),
      total,
    };
  }

  async getSummary(filters: SalesReportFilters): Promise<SalesReportSummary> {
    // Total/count come from `sales` directly (one row per sale) — computing
    // them from a join against `sale_details` would double-count a sale's
    // total once per matching line item.
    const salesQb = this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.status = :status', { status: 'CONFIRMED' });
    this.applyDateUserFilters(salesQb, filters);
    this.applyProductExistsFilter(salesQb, filters);
    salesQb
      .select('COALESCE(SUM(sale.total), 0)', 'totalAmount')
      .addSelect('COUNT(sale.id)', 'salesCount');
    const salesRaw = await salesQb.getRawOne<{
      totalAmount: string;
      salesCount: string;
    }>();

    // Units sold DOES respect the category/product filter — it's "how many
    // units of what I asked about", scoped to the matching line items only.
    const detailsQb = this.saleDetailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.sale', 'sale')
      .innerJoin('detail.product', 'product')
      .where('sale.status = :status', { status: 'CONFIRMED' });
    this.applyDateUserFilters(detailsQb, filters, 'sale');
    this.applyProductFilters(detailsQb, filters, 'detail', 'product');
    detailsQb.select('COALESCE(SUM(detail.quantity), 0)', 'unitsSold');
    const detailsRaw = await detailsQb.getRawOne<{ unitsSold: string }>();

    const totalAmount = parseFloat(salesRaw?.totalAmount ?? '0');
    const salesCount = parseInt(salesRaw?.salesCount ?? '0', 10);
    const unitsSold = parseInt(detailsRaw?.unitsSold ?? '0', 10);

    return {
      totalAmount,
      salesCount,
      unitsSold,
      averageTicket: salesCount > 0 ? totalAmount / salesCount : 0,
    };
  }

  async getByProduct(
    filters: SalesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<SalesByProductRow>> {
    const baseQb = this.saleDetailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.sale', 'sale')
      .innerJoin('detail.product', 'product')
      .where('sale.status = :status', { status: 'CONFIRMED' });
    this.applyDateUserFilters(baseQb, filters, 'sale');
    this.applyProductFilters(baseQb, filters, 'detail', 'product');

    const countQb = baseQb
      .clone()
      .select('COUNT(DISTINCT product.id)', 'count');
    const countRaw = await countQb.getRawOne<{ count: string }>();
    const total = parseInt(countRaw?.count ?? '0', 10);

    const rowsQb = baseQb
      .clone()
      .select('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('product.sku', 'sku')
      .addSelect('COALESCE(SUM(detail.quantity), 0)', 'quantitySold')
      .addSelect('COALESCE(SUM(detail.total), 0)', 'totalRevenue')
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.sku')
      .orderBy('SUM(detail.total)', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await rowsQb.getRawMany<{
      productId: string;
      productName: string;
      sku: string | null;
      quantitySold: string;
      totalRevenue: string;
    }>();

    return {
      items: rows.map((row) => ({
        productId: row.productId,
        productName: row.productName,
        sku: row.sku,
        quantitySold: parseInt(row.quantitySold, 10),
        totalRevenue: parseFloat(row.totalRevenue),
      })),
      total,
    };
  }

  /** Date range + user equality — applies cleanly whether `qb` is rooted on `sales` or already joined out to `sale_details`/`products`. */
  private applyDateUserFilters(
    qb: SelectQueryBuilder<any>,
    filters: SalesReportFilters,
    saleAlias = 'sale',
  ): void {
    if (filters.startDate) {
      qb.andWhere(`${saleAlias}.saleDate >= :startDate`, {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere(`${saleAlias}.saleDate <= :endDate`, {
        endDate: filters.endDate,
      });
    }
    if (filters.userId) {
      qb.andWhere(`${saleAlias}.userId = :userId`, { userId: filters.userId });
    }
  }

  /**
   * "This sale has at least one line matching the category/product filter" —
   * an `EXISTS` subquery, not a join, specifically so it can run against a
   * query rooted on `sales` (`findAll`, `getSummary`'s total/count half)
   * without fanning that query out to one row per matching line. Callers
   * that are *already* joined to `sale_details`/`products` (`getSummary`'s
   * units-sold half, `getByProduct`) use `applyProductFilters` instead — a
   * plain equality check against the join that's already there.
   */
  private applyProductExistsFilter(
    qb: SelectQueryBuilder<any>,
    filters: SalesReportFilters,
    saleAlias = 'sale',
  ): void {
    if (!filters.categoryId && !filters.businessId && !filters.productId) {
      return;
    }
    qb.andWhere(
      (subQb: SelectQueryBuilder<any>) => {
        const sub = subQb
          .subQuery()
          .select('1')
          .from(SaleDetailOrmEntity, 'sd')
          .innerJoin('sd.product', 'p')
          .where(`sd.saleId = ${saleAlias}.id`);
        if (filters.productId) {
          sub.andWhere('sd.productId = :existsProductId');
        }
        if (filters.categoryId) {
          sub.andWhere('p.categoryId = :existsCategoryId');
        }
        if (filters.businessId) {
          sub.andWhere('p.businessId = :existsBusinessId');
        }
        return `EXISTS ${sub.getQuery()}`;
      },
      {
        existsProductId: filters.productId,
        existsCategoryId: filters.categoryId,
        existsBusinessId: filters.businessId,
      },
    );
  }

  /** Direct equality filters for a query already joined to `sale_details`/`products` — used by `getSummary`/`getByProduct`, which need the filter applied to the matching line itself, not via EXISTS. */
  private applyProductFilters(
    qb: SelectQueryBuilder<SaleDetailOrmEntity>,
    filters: SalesReportFilters,
    detailAlias: string,
    productAlias: string,
  ): void {
    if (filters.productId) {
      qb.andWhere(`${detailAlias}.productId = :productId`, {
        productId: filters.productId,
      });
    }
    if (filters.categoryId) {
      qb.andWhere(`${productAlias}.categoryId = :categoryId`, {
        categoryId: filters.categoryId,
      });
    }
    if (filters.businessId) {
      qb.andWhere(`${productAlias}.businessId = :businessId`, {
        businessId: filters.businessId,
      });
    }
  }
}
