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
        quantity: item.quantity,
        costPrice: item.costPrice,
        publicPrice: item.publicPrice,
      })),
    );

    let purchaseId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_purchase: string }[]
      >('SELECT confirm_purchase($1, $2, $3, $4::jsonb)', [
        data.supplierId,
        data.userId,
        data.purchaseDate,
        itemsJson,
      ]);
      purchaseId = rows[0].confirm_purchase;
    } catch (error) {
      throw this.translatePurchaseError(error);
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
      default:
        return error;
    }
  }
}
