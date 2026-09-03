import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IceCreamSaleDetailOrmEntity } from '../../../ice-creams/infrastructure/persistence/ice-cream-sale-detail.orm-entity';
import {
  IceCreamSalesReportFilters,
  IceCreamSalesReportRepository,
  IceCreamSalesReportRow,
  IceCreamSalesReportSummary,
  PaginatedReportResult,
} from '../../domain/repositories/ice-cream-sales-report.repository';

/**
 * Deliberately rooted on `IceCreamSaleDetailOrmEntity` (one row per line
 * item sold), unlike `TypeOrmSalesReportRepository` (rooted on the sale
 * header, one row per sale, specifically to avoid a `sale.items` join
 * fanning out the row count/pagination — see that repository's own doc
 * comment). This report's own ticket asked for one row per product
 * movement, not per sale, so there's no fan-out to guard against here —
 * `detail` already is the row granularity this report wants.
 */
@Injectable()
export class TypeOrmIceCreamSalesReportRepository implements IceCreamSalesReportRepository {
  constructor(
    @InjectRepository(IceCreamSaleDetailOrmEntity)
    private readonly detailRepository: Repository<IceCreamSaleDetailOrmEntity>,
  ) {}

  async findAll(
    filters: IceCreamSalesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<IceCreamSalesReportRow>> {
    const qb = this.baseQuery(filters);

    const total = await qb.clone().getCount();

    qb.select('detail.id', 'id')
      .addSelect('detail.saleId', 'saleId')
      .addSelect('sale.saleDate', 'date')
      .addSelect('iceCream.product', 'product')
      .addSelect('iceCream.sku', 'sku')
      .addSelect('detail.quantity', 'quantity')
      .addSelect('detail.unitPrice', 'unitPrice')
      .addSelect('detail.total', 'total')
      .addSelect('sale.userId', 'userId')
      .addSelect('user.username', 'username')
      .orderBy('sale.saleDate', 'DESC')
      .addOrderBy('detail.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      saleId: string;
      date: Date;
      product: string;
      sku: string;
      quantity: number;
      unitPrice: string;
      total: string;
      userId: string;
      username: string | null;
    }>();

    return {
      items: rows.map((row) => ({
        id: row.id,
        saleId: row.saleId,
        date: row.date,
        product: row.product,
        sku: row.sku,
        quantity: row.quantity,
        unitPrice: parseFloat(row.unitPrice),
        total: parseFloat(row.total),
        userId: row.userId,
        username: row.username ?? '—',
      })),
      total,
    };
  }

  async getSummary(
    filters: IceCreamSalesReportFilters,
  ): Promise<IceCreamSalesReportSummary> {
    const qb = this.baseQuery(filters);
    qb.select('COALESCE(SUM(detail.total), 0)', 'totalSold')
      .addSelect('COALESCE(SUM(detail.quantity), 0)', 'totalQuantity')
      .addSelect('COUNT(detail.id)', 'recordCount');

    const raw = await qb.getRawOne<{
      totalSold: string;
      totalQuantity: string;
      recordCount: string;
    }>();

    const totalSold = parseFloat(raw?.totalSold ?? '0');
    const totalQuantity = parseInt(raw?.totalQuantity ?? '0', 10);
    const recordCount = parseInt(raw?.recordCount ?? '0', 10);

    return {
      totalSold,
      totalQuantity,
      recordCount,
      averagePrice: recordCount > 0 ? totalSold / recordCount : 0,
    };
  }

  private baseQuery(
    filters: IceCreamSalesReportFilters,
  ): SelectQueryBuilder<IceCreamSaleDetailOrmEntity> {
    const qb = this.detailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.sale', 'sale')
      .innerJoin('detail.iceCream', 'iceCream')
      .innerJoin('sale.user', 'user');

    if (filters.startDate) {
      qb.andWhere('sale.saleDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('sale.saleDate <= :endDate', { endDate: filters.endDate });
    }
    if (filters.iceCreamId) {
      qb.andWhere('detail.iceCreamId = :iceCreamId', {
        iceCreamId: filters.iceCreamId,
      });
    }
    if (filters.userId) {
      qb.andWhere('sale.userId = :userId', { userId: filters.userId });
    }
    if (filters.minPrice !== undefined) {
      qb.andWhere('detail.unitPrice >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('detail.unitPrice <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }
    if (filters.minQuantity !== undefined) {
      qb.andWhere('detail.quantity >= :minQuantity', {
        minQuantity: filters.minQuantity,
      });
    }

    return qb;
  }
}
