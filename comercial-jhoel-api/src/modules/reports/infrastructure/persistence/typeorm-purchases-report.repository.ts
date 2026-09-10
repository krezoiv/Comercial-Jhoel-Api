import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PurchaseOrmEntity } from '../../../purchases/infrastructure/persistence/purchase.orm-entity';
import { PurchaseDetailOrmEntity } from '../../../purchases/infrastructure/persistence/purchase-detail.orm-entity';
import {
  PaginatedReportResult,
  PurchasesByProductRow,
  PurchasesReportFilters,
  PurchasesReportRepository,
  PurchasesReportRow,
  PurchasesReportSummary,
  ReportSortField,
  SortDirection,
} from '../../domain/repositories/purchases-report.repository';

const SORT_COLUMN: Record<ReportSortField, string> = {
  date: 'purchase.purchaseDate',
  total: 'purchase.total',
};

@Injectable()
export class TypeOrmPurchasesReportRepository implements PurchasesReportRepository {
  constructor(
    @InjectRepository(PurchaseOrmEntity)
    private readonly purchaseRepository: Repository<PurchaseOrmEntity>,
    @InjectRepository(PurchaseDetailOrmEntity)
    private readonly purchaseDetailRepository: Repository<PurchaseDetailOrmEntity>,
  ) {}

  async findAll(
    filters: PurchasesReportFilters,
    page: number,
    limit: number,
    sortBy: ReportSortField,
    sortDirection: SortDirection,
  ): Promise<PaginatedReportResult<PurchasesReportRow>> {
    const qb = this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.user', 'user')
      .leftJoin('purchase.supplier', 'supplier');

    this.applyDateUserSupplierFilters(qb, filters);
    this.applyProductExistsFilter(qb, filters);

    const total = await qb.clone().getCount();

    // Scalar correlated subquery, not a join — same fan-out reasoning as the
    // sales report's `findAll`. Raw select + `getRawMany()` throughout, same
    // reason as the sales report (this TypeORM version has no
    // relation-count-and-map helper).
    qb.select('purchase.id', 'id')
      .addSelect('purchase.purchaseDate', 'purchaseDate')
      .addSelect('purchase.total', 'total')
      .addSelect('purchase.userId', 'userId')
      .addSelect('purchase.supplierId', 'supplierId')
      .addSelect('purchase.invoiceNumber', 'invoiceNumber')
      .addSelect('purchase.isVoided', 'isVoided')
      .addSelect('user.username', 'username')
      .addSelect('supplier.name', 'supplierName')
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'count')
            .from(PurchaseDetailOrmEntity, 'pd')
            .where('pd.purchaseId = purchase.id'),
        'itemCount',
      )
      .orderBy(SORT_COLUMN[sortBy], sortDirection === 'asc' ? 'ASC' : 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const rows = await qb.getRawMany<{
      id: string;
      purchaseDate: Date;
      total: string;
      userId: string;
      supplierId: string;
      invoiceNumber: string | null;
      isVoided: boolean;
      username: string | null;
      supplierName: string | null;
      itemCount: string;
    }>();

    return {
      items: rows.map((row) => ({
        id: row.id,
        purchaseNumber: `C-${row.id.slice(0, 8).toUpperCase()}`,
        purchaseDate: row.purchaseDate,
        supplierId: row.supplierId,
        supplierName: row.supplierName ?? '—',
        userId: row.userId,
        username: row.username ?? '—',
        itemCount: parseInt(row.itemCount, 10),
        total: parseFloat(row.total),
        invoiceNumber: row.invoiceNumber,
        isVoided: row.isVoided,
      })),
      total,
    };
  }

  async getSummary(
    filters: PurchasesReportFilters,
  ): Promise<PurchasesReportSummary> {
    // Total/count from `purchases` directly — a join against
    // `purchase_details` would double-count a purchase's total once per
    // matching line item.
    const purchasesQb = this.purchaseRepository
      .createQueryBuilder('purchase')
      .where('purchase.isVoided = false');
    this.applyDateUserSupplierFilters(purchasesQb, filters);
    this.applyProductExistsFilter(purchasesQb, filters);
    purchasesQb
      .select('COALESCE(SUM(purchase.total), 0)', 'totalAmount')
      .addSelect('COUNT(purchase.id)', 'purchasesCount');
    const purchasesRaw = await purchasesQb.getRawOne<{
      totalAmount: string;
      purchasesCount: string;
    }>();

    // Units purchased DOES respect the category/product filter — scoped to
    // the matching line items only.
    const detailsQb = this.purchaseDetailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.purchase', 'purchase')
      .innerJoin('detail.product', 'product')
      .where('purchase.isVoided = false');
    this.applyDateUserSupplierFilters(detailsQb, filters, 'purchase');
    this.applyProductFilters(detailsQb, filters, 'detail', 'product');
    detailsQb.select('COALESCE(SUM(detail.quantity), 0)', 'unitsPurchased');
    const detailsRaw = await detailsQb.getRawOne<{ unitsPurchased: string }>();

    const totalAmount = parseFloat(purchasesRaw?.totalAmount ?? '0');
    const purchasesCount = parseInt(purchasesRaw?.purchasesCount ?? '0', 10);
    const unitsPurchased = parseInt(detailsRaw?.unitsPurchased ?? '0', 10);

    return {
      totalAmount,
      purchasesCount,
      unitsPurchased,
      averagePurchase: purchasesCount > 0 ? totalAmount / purchasesCount : 0,
    };
  }

  async getByProduct(
    filters: PurchasesReportFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedReportResult<PurchasesByProductRow>> {
    const baseQb = this.purchaseDetailRepository
      .createQueryBuilder('detail')
      .innerJoin('detail.purchase', 'purchase')
      .innerJoin('detail.product', 'product')
      .where('purchase.isVoided = false');
    this.applyDateUserSupplierFilters(baseQb, filters, 'purchase');
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
      .addSelect('COALESCE(SUM(detail.quantity), 0)', 'quantityPurchased')
      .addSelect('COALESCE(SUM(detail.total), 0)', 'totalCost')
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
      quantityPurchased: string;
      totalCost: string;
    }>();

    return {
      items: rows.map((row) => ({
        productId: row.productId,
        productName: row.productName,
        sku: row.sku,
        quantityPurchased: parseInt(row.quantityPurchased, 10),
        totalCost: parseFloat(row.totalCost),
      })),
      total,
    };
  }

  /** Date range + user + supplier equality — applies cleanly whether `qb` is rooted on `purchases` or already joined out to `purchase_details`/`products`. */
  private applyDateUserSupplierFilters(
    qb: SelectQueryBuilder<any>,
    filters: PurchasesReportFilters,
    purchaseAlias = 'purchase',
  ): void {
    if (filters.startDate) {
      qb.andWhere(`${purchaseAlias}.purchaseDate >= :startDate`, {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere(`${purchaseAlias}.purchaseDate <= :endDate`, {
        endDate: filters.endDate,
      });
    }
    if (filters.userId) {
      qb.andWhere(`${purchaseAlias}.userId = :userId`, {
        userId: filters.userId,
      });
    }
    if (filters.supplierId) {
      qb.andWhere(`${purchaseAlias}.supplierId = :supplierId`, {
        supplierId: filters.supplierId,
      });
    }
  }

  /** Same "at least one matching line" EXISTS approach as the sales report's `findAll`/`getSummary` — keeps a query rooted on `purchases` from fanning out. */
  private applyProductExistsFilter(
    qb: SelectQueryBuilder<any>,
    filters: PurchasesReportFilters,
    purchaseAlias = 'purchase',
  ): void {
    if (!filters.categoryId && !filters.businessId && !filters.productId) {
      return;
    }
    qb.andWhere(
      (subQb: SelectQueryBuilder<any>) => {
        const sub = subQb
          .subQuery()
          .select('1')
          .from(PurchaseDetailOrmEntity, 'pd')
          .innerJoin('pd.product', 'p')
          .where(`pd.purchaseId = ${purchaseAlias}.id`);
        if (filters.productId) {
          sub.andWhere('pd.productId = :existsProductId');
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

  /** Direct equality filters for a query already joined to `purchase_details`/`products` — used by `getSummary`/`getByProduct`. */
  private applyProductFilters(
    qb: SelectQueryBuilder<PurchaseDetailOrmEntity>,
    filters: PurchasesReportFilters,
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
