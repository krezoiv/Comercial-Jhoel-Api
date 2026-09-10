import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Purchase } from '../../domain/entities/purchase.entity';
import {
  ConfirmPurchaseData,
  FindPurchasesOptions,
  PaginatedResult,
  PurchaseRepository,
  PurchaseSortField,
} from '../../domain/repositories/purchase.repository';
import { PurchaseEmptyError } from '../../domain/errors/purchase-empty.error';
import { InvalidSupplierError } from '../../domain/errors/invalid-supplier.error';
import { PurchaseProductNotFoundError } from '../../domain/errors/purchase-product-not-found.error';
import { PurchaseProductInactiveError } from '../../domain/errors/purchase-product-inactive.error';
import { InvalidPurchaseQuantityError } from '../../domain/errors/invalid-purchase-quantity.error';
import { InvalidPurchasePriceError } from '../../domain/errors/invalid-purchase-price.error';
import { InvalidPaymentDataError } from '../../domain/errors/invalid-payment-data.error';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAlreadyVoidedError } from '../../domain/errors/purchase-already-voided.error';
import { PurchaseVoidReasonRequiredError } from '../../domain/errors/purchase-void-reason-required.error';
import { PurchaseVoidBlockedByPaymentError } from '../../domain/errors/purchase-void-blocked-by-payment.error';
import { InsufficientStockToRevertPurchaseError } from '../../domain/errors/insufficient-stock-to-revert-purchase.error';
import { PurchaseOrmEntity } from './purchase.orm-entity';
import { PurchaseMapper } from './purchase.mapper';

const SORT_COLUMN: Record<PurchaseSortField, string> = {
  purchaseDate: 'purchase.purchaseDate',
  total: 'purchase.total',
  createdAt: 'purchase.createdAt',
};

@Injectable()
export class TypeOrmPurchaseRepository implements PurchaseRepository {
  constructor(
    @InjectRepository(PurchaseOrmEntity)
    private readonly repository: Repository<PurchaseOrmEntity>,
  ) {}

  async confirmPurchase(data: ConfirmPurchaseData): Promise<Purchase> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        productId: item.productId,
        presentationId: item.presentationId ?? null,
        quantity: item.quantity,
        costPrice: item.costPrice,
        publicPrice: item.publicPrice,
      })),
    );

    let purchaseId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_purchase: string }[]
      >('SELECT confirm_purchase($1, $2, $3, $4::jsonb, $5, $6)', [
        data.supplierId,
        data.userId,
        data.purchaseDate,
        itemsJson,
        data.paymentType,
        data.paymentDueDate ?? null,
      ]);
      purchaseId = rows[0].confirm_purchase;
    } catch (error) {
      throw this.translatePurchaseError(error);
    }

    // `confirm_purchase` itself has no `invoiceNumber` parameter — it's a
    // free-text search aid with no effect on any of the function's
    // financial/inventory logic, so it's set with a plain follow-up
    // `UPDATE` rather than widening the stored function's own signature.
    if (data.invoiceNumber) {
      await this.repository.update(
        { id: purchaseId },
        { invoiceNumber: data.invoiceNumber },
      );
    }

    const purchase = await this.findById(purchaseId);
    if (!purchase) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra recién creada.',
      );
    }
    return purchase;
  }

  async findAll(
    options: FindPurchasesOptions,
  ): Promise<PaginatedResult<Purchase>> {
    const qb = this.repository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.supplier', 'supplier')
      .leftJoinAndSelect('purchase.user', 'user');

    if (options.userId) {
      qb.andWhere('purchase.userId = :userId', { userId: options.userId });
    }
    if (options.supplierId) {
      qb.andWhere('purchase.supplierId = :supplierId', {
        supplierId: options.supplierId,
      });
    }
    if (options.startDate) {
      qb.andWhere('purchase.purchaseDate >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options.endDate) {
      qb.andWhere('purchase.purchaseDate <= :endDate', {
        endDate: `${options.endDate} 23:59:59.999`,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(supplier.name ILIKE :search OR purchase.invoiceNumber ILIKE :search)',
        { search: `%${options.search}%` },
      );
    }
    if (options.status === 'ACTIVE') {
      qb.andWhere('purchase.isVoided = false');
    } else if (options.status === 'VOIDED') {
      qb.andWhere('purchase.isVoided = true');
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      // No `items` join here on purpose — the list view is a summary; see findById for the full detail.
      items: orms.map((orm) => PurchaseMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<Purchase | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    return orm ? PurchaseMapper.toDomain(orm) : null;
  }

  async markAsPaid(id: string, paidBy: string): Promise<Purchase> {
    await this.repository.update(
      { id },
      { paymentStatus: 'PAID', paidAt: new Date(), paidBy },
    );
    const purchase = await this.findById(id);
    if (!purchase) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra recién pagada.',
      );
    }
    return purchase;
  }

  async findPendingCreditPurchases(options?: {
    userId?: string;
  }): Promise<Purchase[]> {
    const qb = this.repository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.supplier', 'supplier')
      .leftJoinAndSelect('purchase.user', 'user')
      .where('purchase.paymentType = :paymentType', { paymentType: 'CREDITO' })
      .andWhere('purchase.paymentStatus = :paymentStatus', {
        paymentStatus: 'PENDING',
      })
      .andWhere('purchase.isVoided = false');

    if (options?.userId) {
      qb.andWhere('purchase.userId = :userId', { userId: options.userId });
    }

    qb.orderBy('purchase.paymentDueDate', 'ASC');

    const orms = await qb.getMany();
    return orms.map((orm) => PurchaseMapper.toDomain(orm));
  }

  async voidPurchase(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<Purchase> {
    try {
      await this.repository.manager.query(
        'SELECT void_purchase($1, $2, $3)',
        [id, voidedBy, reason],
      );
    } catch (error) {
      throw this.translatePurchaseVoidError(error);
    }

    const purchase = await this.findById(id);
    if (!purchase) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la factura recién anulada.',
      );
    }
    return purchase;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation pattern as `translatePurchaseError` — kept separate since the codes don't overlap. */
  private translatePurchaseVoidError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, identifier] = message.split(':');

    switch (code) {
      case 'VOID_REASON_REQUIRED':
        return new PurchaseVoidReasonRequiredError();
      case 'PURCHASE_NOT_FOUND':
        return new PurchaseNotFoundError(identifier);
      case 'PURCHASE_ALREADY_VOIDED':
        return new PurchaseAlreadyVoidedError(identifier);
      case 'PURCHASE_HAS_PAYMENT':
        return new PurchaseVoidBlockedByPaymentError();
      case 'INSUFFICIENT_STOCK_TO_REVERT':
        return new InsufficientStockToRevertPurchaseError(identifier);
      default:
        return error;
    }
  }

  /** Same `RAISE EXCEPTION '<CODE>:<productId>'` → domain-error translation as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. */
  private translatePurchaseError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code, productId] = message.split(':');

    switch (code) {
      case 'PURCHASE_EMPTY':
        return new PurchaseEmptyError();
      case 'SUPPLIER_NOT_FOUND':
      case 'SUPPLIER_INACTIVE':
        return new InvalidSupplierError();
      case 'PRODUCT_NOT_FOUND':
        return new PurchaseProductNotFoundError(productId);
      case 'PRODUCT_INACTIVE':
        return new PurchaseProductInactiveError(productId);
      case 'INVALID_QUANTITY':
        return new InvalidPurchaseQuantityError(productId);
      case 'INVALID_PRICE':
        return new InvalidPurchasePriceError(productId);
      case 'INVALID_PAYMENT_TYPE':
        return new InvalidPaymentDataError(
          'El tipo de compra debe ser Contado o Crédito.',
        );
      case 'PAYMENT_DUE_DATE_REQUIRED':
        return new InvalidPaymentDataError(
          'Debe indicar la fecha de pago para una compra a crédito.',
        );
      default:
        return error;
    }
  }
}
