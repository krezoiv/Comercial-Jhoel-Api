import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Sale } from '../../domain/entities/sale.entity';
import {
  AdjustSaleItemData,
  ConfirmSaleData,
  FindSalesOptions,
  PaginatedResult,
  SaleRepository,
  SaleSortField,
} from '../../domain/repositories/sale.repository';
import { SaleEmptyError } from '../../domain/errors/sale-empty.error';
import { SaleProductNotFoundError } from '../../domain/errors/sale-product-not-found.error';
import { SaleProductInactiveError } from '../../domain/errors/sale-product-inactive.error';
import { InsufficientStockError } from '../../domain/errors/insufficient-stock.error';
import { InvalidSaleQuantityError } from '../../domain/errors/invalid-sale-quantity.error';
import { NoOpenSaleError } from '../../domain/errors/no-open-sale.error';
import { SaleOrmEntity } from './sale.orm-entity';
import { SaleMapper } from './sale.mapper';

const SORT_COLUMN: Record<SaleSortField, string> = {
  saleDate: 'sale.saleDate',
  total: 'sale.total',
  createdAt: 'sale.createdAt',
};

@Injectable()
export class TypeOrmSaleRepository implements SaleRepository {
  constructor(
    @InjectRepository(SaleOrmEntity)
    private readonly repository: Repository<SaleOrmEntity>,
  ) {}

  async confirmSale(data: ConfirmSaleData): Promise<Sale> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );

    let saleId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_sale: string }[]
      >('SELECT confirm_sale($1, $2::jsonb)', [data.userId, itemsJson]);
      saleId = rows[0].confirm_sale;
    } catch (error) {
      throw this.translateSaleError(error);
    }

    const sale = await this.findById(saleId);
    if (!sale) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta recién creada.',
      );
    }
    return sale;
  }

  async findAll(options: FindSalesOptions): Promise<PaginatedResult<Sale>> {
    const qb = this.repository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user')
      // A listing is sales history — an in-progress receipt isn't a sale yet.
      .andWhere('sale.status = :status', { status: 'CONFIRMED' });

    if (options.userId) {
      qb.andWhere('sale.userId = :userId', { userId: options.userId });
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      // No `items` join here on purpose — the list view is a summary; see findById for the full detail.
      items: orms.map((orm) => SaleMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<Sale | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    return orm ? SaleMapper.toDomain(orm) : null;
  }

  async adjustItem(data: AdjustSaleItemData): Promise<Sale> {
    let saleId: string;
    try {
      const rows = await this.repository.manager.query<
        { adjust_sale_item: string }[]
      >('SELECT adjust_sale_item($1, $2, $3)', [
        data.userId,
        data.productId,
        data.quantityDelta,
      ]);
      saleId = rows[0].adjust_sale_item;
    } catch (error) {
      throw this.translateSaleError(error);
    }

    const sale = await this.findById(saleId);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta en construcción.',
      );
    }
    return sale;
  }

  async findOpenSaleByUserId(userId: string): Promise<Sale | null> {
    const orm = await this.repository.findOne({
      where: { userId, status: 'OPEN' },
      relations: { items: { product: true } },
    });
    return orm ? SaleMapper.toDomain(orm) : null;
  }

  async confirmOpenSale(userId: string): Promise<Sale> {
    const openSale = await this.repository.findOne({
      where: { userId, status: 'OPEN' },
      relations: { items: true },
    });
    if (!openSale) {
      throw new NoOpenSaleError();
    }
    if (!openSale.items || openSale.items.length === 0) {
      throw new SaleEmptyError();
    }

    await this.repository.update(
      { id: openSale.id },
      { status: 'CONFIRMED', saleDate: new Date() },
    );

    const sale = await this.findById(openSale.id);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta confirmada.',
      );
    }
    return sale;
  }

  async cancelOpenSale(userId: string): Promise<boolean> {
    const rows = await this.repository.manager.query<
      { cancel_open_sale: boolean }[]
    >('SELECT cancel_open_sale($1)', [userId]);
    return rows[0].cancel_open_sale;
  }

  private translateSaleError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, productId] = message.split(':');

    switch (code) {
      case 'SALE_EMPTY':
        return new SaleEmptyError();
      case 'PRODUCT_NOT_FOUND':
        return new SaleProductNotFoundError(productId);
      case 'PRODUCT_INACTIVE':
        return new SaleProductInactiveError(productId);
      case 'INSUFFICIENT_STOCK':
        return new InsufficientStockError(productId);
      case 'INVALID_QUANTITY':
        return new InvalidSaleQuantityError(productId);
      default:
        return error;
    }
  }
}
