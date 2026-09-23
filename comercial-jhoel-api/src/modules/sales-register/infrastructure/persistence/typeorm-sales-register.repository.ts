import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleOrmEntity } from '../../../sales/infrastructure/persistence/sale.orm-entity';
import { SaleDetailOrmEntity } from '../../../sales/infrastructure/persistence/sale-detail.orm-entity';
import {
  BusinessProductRow,
  BusinessTotalsRow,
  DateRange,
  OverallTotals,
  SalesRegisterRawData,
  SalesRegisterRepository,
} from '../../domain/repositories/sales-register.repository';

@Injectable()
export class TypeOrmSalesRegisterRepository
  implements SalesRegisterRepository
{
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly saleRepository: Repository<SaleOrmEntity>,
    @InjectRepository(SaleDetailOrmEntity)
    private readonly saleDetailRepository: Repository<SaleDetailOrmEntity>,
  ) {}

  async getDailyData(range: DateRange): Promise<SalesRegisterRawData> {
    const [overallRaw, businessRaw, productRaw] = await Promise.all([
      this.saleRepository
        .createQueryBuilder('sale')
        .where('sale.status = :status', { status: 'CONFIRMED' })
        .andWhere('sale.isVoided = false')
        .andWhere('sale.saleDate >= :start', { start: range.start })
        .andWhere('sale.saleDate <= :end', { end: range.end })
        .select('COALESCE(SUM(sale.total), 0)', 'totalAmount')
        .addSelect('COUNT(sale.id)', 'salesCount')
        .getRawOne<{ totalAmount: string; salesCount: string }>(),

      this.saleDetailRepository
        .createQueryBuilder('detail')
        .innerJoin('detail.sale', 'sale')
        .innerJoin('detail.business', 'business')
        .where('sale.status = :status', { status: 'CONFIRMED' })
        .andWhere('sale.isVoided = false')
        .andWhere('sale.saleDate >= :start', { start: range.start })
        .andWhere('sale.saleDate <= :end', { end: range.end })
        .select('detail.businessId', 'businessId')
        .addSelect('business.name', 'businessName')
        .addSelect('COUNT(DISTINCT detail.saleId)', 'salesCount')
        .addSelect('COALESCE(SUM(detail.quantity), 0)', 'productsCount')
        .addSelect('COALESCE(SUM(detail.total), 0)', 'totalAmount')
        .groupBy('detail.businessId')
        .addGroupBy('business.name')
        .orderBy('SUM(detail.total)', 'DESC')
        .getRawMany<{
          businessId: string;
          businessName: string;
          salesCount: string;
          productsCount: string;
          totalAmount: string;
        }>(),

      this.saleDetailRepository
        .createQueryBuilder('detail')
        .innerJoin('detail.sale', 'sale')
        .innerJoin('detail.product', 'product')
        .where('sale.status = :status', { status: 'CONFIRMED' })
        .andWhere('sale.isVoided = false')
        .andWhere('sale.saleDate >= :start', { start: range.start })
        .andWhere('sale.saleDate <= :end', { end: range.end })
        .select('detail.businessId', 'businessId')
        .addSelect('product.id', 'productId')
        .addSelect('product.name', 'productName')
        .addSelect('product.sku', 'sku')
        .addSelect('COALESCE(SUM(detail.quantity), 0)', 'quantitySold')
        .addSelect('COALESCE(SUM(detail.total), 0)', 'totalRevenue')
        .groupBy('detail.businessId')
        .addGroupBy('product.id')
        .addGroupBy('product.name')
        .addGroupBy('product.sku')
        .orderBy('detail.businessId', 'ASC')
        .addOrderBy('SUM(detail.total)', 'DESC')
        .getRawMany<{
          businessId: string;
          productId: string;
          productName: string;
          sku: string | null;
          quantitySold: string;
          totalRevenue: string;
        }>(),
    ]);

    const overall: OverallTotals = {
      totalAmount: parseFloat(overallRaw?.totalAmount ?? '0'),
      salesCount: parseInt(overallRaw?.salesCount ?? '0', 10),
    };

    const businessTotals: BusinessTotalsRow[] = businessRaw.map((row) => ({
      businessId: row.businessId,
      businessName: row.businessName,
      salesCount: parseInt(row.salesCount, 10),
      productsCount: parseInt(row.productsCount, 10),
      totalAmount: parseFloat(row.totalAmount),
    }));

    const productRows: BusinessProductRow[] = productRaw.map((row) => ({
      businessId: row.businessId,
      productId: row.productId,
      productName: row.productName,
      sku: row.sku,
      quantitySold: parseInt(row.quantitySold, 10),
      totalRevenue: parseFloat(row.totalRevenue),
    }));

    return { overall, businessTotals, productRows };
  }
}
