import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IceCreamPurchaseDetailOrmEntity } from '../../../ice-creams/infrastructure/persistence/ice-cream-purchase-detail.orm-entity';
import {
  IceCreamPurchasesReportFilters,
  IceCreamPurchasesReportRepository,
  IceCreamPurchasesReportRow,
  IceCreamPurchasesReportSummary,
  PaginatedReportResult,
} from '../../domain/repositories/ice-cream-purchases-report.repository';

/** Structural clone of `TypeOrmIceCreamSalesReportRepository` — see that repository's own doc comment for why this is deliberately rooted on the detail (line-item) table rather than the purchase header. */
@Injectable()
export class TypeOrmIceCreamPurchasesReportRepository implements IceCreamPurchasesReportRepository {
  constructor(
    @InjectRepository(IceCreamPurchaseDetailOrmEntity)
    private readonly detailRepository: Repository<IceCreamPurchaseDetailOrmEntity>,
  ) {}

  async findAll(
    filters: IceCreamPurchasesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<IceCreamPurchasesReportRow>> {
    const qb = this.baseQuery(filters);

    const total = await qb.clone().getCount();

    qb.select('detail.id', 'id')
      .addSelect('detail.purchaseId', 'purchaseId')
      .addSelect('purchase.purchaseDate', 'date')
      .addSelect('purchase.supplierId', 'supplierId')
      .addSelect('supplier.name', 'supplierName')
      .addSelect('iceCream.product', 'product')
      .addSelect('iceCream.sku', 'sku')
      .addSelect('detail.quantity', 'quantity')
      .addSelect('detail.costPrice', 'costPrice')
      .addSelect('detail.subtotal', 'total')
      .addSelect('purchase.userId', 'userId')
      .addSelect('user.username', 'username')
      .orderBy('purchase.purchaseDate', 'DESC')
      .addOrderBy('detail.id', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      purchaseId: string;
      date: Date;
      supplierId: string;
      supplierName: string | null;
      product: string;
      sku: string;
      quantity: number;
      costPrice: string;
      total: string;
      userId: string;
      username: string | null;
    }>();

    return {
      items: rows.map((row) => ({
        id: row.id,
        purchaseId: row.purchaseId,
        date: row.date,
        supplierId: row.supplierId,
        supplierName: row.supplierName ?? '—',
        product: row.product,
        sku: row.sku,
        quantity: row.quantity,
        costPrice: parseFloat(row.costPrice),
        total: parseFloat(row.total),
        userId: row.userId,
        username: row.username ?? '—',
      })),
      total,
    };
  }

  async getSummary(
    filters: IceCreamPurchasesReportFilters,
  ): Promise<IceCreamPurchasesReportSummary> {
    const qb = this.baseQuery(filters);
    qb.select('COALESCE(SUM(detail.subtotal), 0)', 'totalPurchased')
      .addSelect('COALESCE(SUM(detail.quantity), 0)', 'totalQuantity')
      .addSelect('COUNT(detail.id)', 'recordCount');

    const raw = await qb.getRawOne<{
      totalPurchased: string;
      totalQuantity: string;
      recordCount: string;
    }>();

    const totalPurchased = parseFloat(raw?.totalPurchased ?? '0');
    const totalQuantity = parseInt(raw?.totalQuantity ?? '0', 10);
    const recordCount = parseInt(raw?.recordCount ?? '0', 10);

    return {
      totalPurchased,
      totalQuantity,
      recordCount,
      averageCost: recordCount > 0 ? totalPurchased / recordCount : 0,
    };
  }

  private baseQuery(
    filters: IceCreamPurchasesReportFilters,
  ): SelectQueryBuilder<IceCreamPurchaseDetailOrmEntity> {
    const qb = this.detailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.purchase', 'purchase')
      .innerJoin('detail.iceCream', 'iceCream')
      .innerJoin('purchase.user', 'user')
      .innerJoin('purchase.supplier', 'supplier');

    if (filters.startDate) {
      qb.andWhere('purchase.purchaseDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('purchase.purchaseDate <= :endDate', {
        endDate: filters.endDate,
      });
    }
    if (filters.iceCreamId) {
      qb.andWhere('detail.iceCreamId = :iceCreamId', {
        iceCreamId: filters.iceCreamId,
      });
    }
    if (filters.supplierId) {
      qb.andWhere('purchase.supplierId = :supplierId', {
        supplierId: filters.supplierId,
      });
    }
    if (filters.userId) {
      qb.andWhere('purchase.userId = :userId', { userId: filters.userId });
    }

    return qb;
  }
}
