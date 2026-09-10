import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Sale } from '../../domain/entities/sale.entity';
import {
  AdjustSaleItemData,
  ConfigureSalePricingData,
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
import { PriceListLockedError } from '../../domain/errors/price-list-locked.error';
import { SaleNotFoundError } from '../../domain/errors/sale-not-found.error';
import { SaleAlreadyVoidedError } from '../../domain/errors/sale-already-voided.error';
import { SaleVoidReasonRequiredError } from '../../domain/errors/sale-void-reason-required.error';
import { SaleNotConfirmedError } from '../../domain/errors/sale-not-confirmed.error';
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
        presentationId: item.presentationId ?? null,
        quantity: item.quantity,
      })),
    );

    let saleId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_sale: string }[]
      >('SELECT confirm_sale($1, $2::jsonb, $3, $4)', [
        data.userId,
        itemsJson,
        data.clientId ?? null,
        data.priceList ?? 'PUBLIC',
      ]);
      saleId = rows[0].confirm_sale;
    } catch (error) {
      throw this.translateSaleError(error);
    }

    if (data.invoiceNumber) {
      await this.repository.update({ id: saleId }, { invoiceNumber: data.invoiceNumber });
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
      .leftJoin('sale.client', 'client')
      // A listing is sales history — an in-progress receipt isn't a sale yet.
      .andWhere('sale.status = :status', { status: 'CONFIRMED' });

    if (options.userId) {
      qb.andWhere('sale.userId = :userId', { userId: options.userId });
    }
    if (options.clientId) {
      qb.andWhere('sale.clientId = :clientId', { clientId: options.clientId });
    }
    if (options.startDate) {
      qb.andWhere('sale.saleDate >= :startDate', { startDate: options.startDate });
    }
    if (options.endDate) {
      qb.andWhere('sale.saleDate <= :endDate', {
        endDate: `${options.endDate} 23:59:59.999`,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(client.name ILIKE :search OR sale.invoiceNumber ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }
    if (options.status === 'ACTIVE') {
      qb.andWhere('sale.isVoided = false');
    } else if (options.status === 'VOIDED') {
      qb.andWhere('sale.isVoided = true');
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
      >('SELECT adjust_sale_item($1, $2, $3, $4, $5, $6)', [
        data.userId,
        data.productId,
        data.quantityDelta,
        data.presentationId ?? null,
        null, // p_location_id — the live POS UI never sends this yet, same as before this method gained draftKey.
        data.draftKey,
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

  async findOpenSalesByUserId(userId: string): Promise<Sale[]> {
    const orms = await this.repository.find({
      where: { userId, status: 'OPEN' },
      relations: { items: { product: true } },
      order: { createdAt: 'ASC' },
    });
    return orms.map((orm) => SaleMapper.toDomain(orm));
  }

  /**
   * Calls the `confirm_open_sale` Postgres function (see migration
   * `1759400000000-CreateInventoryLocationsAndPresentations`) rather than a
   * plain `UPDATE` — confirming a draft is the one moment a `SALIDA_VENTA`
   * movement row is written per line, and that has to happen atomically
   * alongside the status flip, inside the same function.
   */
  async confirmOpenSale(
    userId: string,
    draftKey: string,
    invoiceNumber?: string,
  ): Promise<Sale> {
    const openSale = await this.repository.findOne({
      where: { userId, draftKey, status: 'OPEN' },
      relations: { items: true },
    });
    if (!openSale) {
      throw new NoOpenSaleError();
    }
    if (!openSale.items || openSale.items.length === 0) {
      throw new SaleEmptyError();
    }

    const rows = await this.repository.manager.query<
      { confirm_open_sale: string | null }[]
    >('SELECT confirm_open_sale($1, $2)', [userId, draftKey]);
    if (!rows[0].confirm_open_sale) {
      throw new NoOpenSaleError();
    }

    if (invoiceNumber) {
      await this.repository.update({ id: openSale.id }, { invoiceNumber });
    }

    const sale = await this.findById(openSale.id);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta confirmada.',
      );
    }
    return sale;
  }

  async cancelOpenSale(userId: string, draftKey: string): Promise<boolean> {
    const rows = await this.repository.manager.query<
      { cancel_open_sale: boolean }[]
    >('SELECT cancel_open_sale($1, $2)', [userId, draftKey]);
    return rows[0].cancel_open_sale;
  }

  async configureOpenSale(data: ConfigureSalePricingData): Promise<Sale> {
    let saleId: string;
    try {
      const rows = await this.repository.manager.query<
        { configure_open_sale: string }[]
      >('SELECT configure_open_sale($1, $2, $3, $4)', [
        data.userId,
        data.clientId,
        data.priceList,
        data.draftKey,
      ]);
      saleId = rows[0].configure_open_sale;
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

  async voidSale(id: string, voidedBy: string, reason: string): Promise<Sale> {
    try {
      await this.repository.manager.query('SELECT void_sale($1, $2, $3)', [
        id,
        voidedBy,
        reason,
      ]);
    } catch (error) {
      throw this.translateSaleVoidError(error);
    }

    const sale = await this.findById(id);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta recién anulada.',
      );
    }
    return sale;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation pattern as `translateSaleError`/`TypeOrmPurchaseRepository.translatePurchaseVoidError` — kept separate since the codes don't overlap. */
  private translateSaleVoidError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, identifier] = message.split(':');

    switch (code) {
      case 'VOID_REASON_REQUIRED':
        return new SaleVoidReasonRequiredError();
      case 'SALE_NOT_FOUND':
        return new SaleNotFoundError(identifier);
      case 'SALE_NOT_CONFIRMED':
        return new SaleNotConfirmedError(identifier);
      case 'SALE_ALREADY_VOIDED':
        return new SaleAlreadyVoidedError(identifier);
      default:
        return error;
    }
  }

  /**
   * `confirm_sale`/`adjust_sale_item` (both stored Postgres functions — see
   * migrations `1757100000000-CreateSalesTables`/`1757200000000-AddDraftSalesSupport`)
   * signal a business-rule failure via `RAISE EXCEPTION '<CODE>:<productId>'`,
   * which the driver surfaces as a `QueryFailedError` whose message embeds
   * that string. Parsing it back into the matching domain error here is what
   * lets a stock/quantity/product failure raised inside Postgres reach the
   * `GlobalExceptionFilter` as the same typed error a TypeScript-level check
   * would have thrown — the HTTP caller can't tell which layer caught it.
   */
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
      case 'PRICE_LIST_LOCKED':
        return new PriceListLockedError();
      default:
        return error;
    }
  }
}
