import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IceCreamPurchase } from '../../domain/entities/ice-cream-purchase.entity';
import {
  ConfirmIceCreamPurchaseData,
  FindIceCreamPurchasesOptions,
  IceCreamPurchaseRepository,
  IceCreamPurchaseSortField,
  PaginatedResult,
} from '../../domain/repositories/ice-cream-purchase.repository';
import { IceCreamPurchaseEmptyError } from '../../domain/errors/ice-cream-purchase-empty.error';
import { InvalidIceCreamSupplierError } from '../../domain/errors/invalid-ice-cream-supplier.error';
import { IceCreamNotFoundError } from '../../domain/errors/ice-cream-not-found.error';
import { IceCreamInactiveError } from '../../domain/errors/ice-cream-inactive.error';
import { InvalidIceCreamQuantityError } from '../../domain/errors/invalid-ice-cream-quantity.error';
import { InvalidIceCreamPriceError } from '../../domain/errors/invalid-ice-cream-price.error';
import { IceCreamPurchaseOrmEntity } from './ice-cream-purchase.orm-entity';
import { IceCreamPurchaseMapper } from './ice-cream-purchase.mapper';

const SORT_COLUMN: Record<IceCreamPurchaseSortField, string> = {
  purchaseDate: 'purchase.purchaseDate',
  total: 'purchase.total',
  createdAt: 'purchase.createdAt',
};

@Injectable()
export class TypeOrmIceCreamPurchaseRepository implements IceCreamPurchaseRepository {
  constructor(
    @InjectRepository(IceCreamPurchaseOrmEntity)
    private readonly repository: Repository<IceCreamPurchaseOrmEntity>,
  ) {}

  async confirmPurchase(
    data: ConfirmIceCreamPurchaseData,
  ): Promise<IceCreamPurchase> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        iceCreamId: item.iceCreamId,
        quantity: item.quantity,
        costPrice: item.costPrice,
      })),
    );

    let purchaseId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_ice_cream_purchase: string }[]
      >('SELECT confirm_ice_cream_purchase($1, $2, $3, $4::jsonb)', [
        data.supplierId,
        data.userId,
        data.purchaseDate,
        itemsJson,
      ]);
      purchaseId = rows[0].confirm_ice_cream_purchase;
    } catch (error) {
      throw this.translatePurchaseError(error);
    }

    const purchase = await this.findById(purchaseId);
    if (!purchase) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la compra recién creada.',
      );
    }
    return purchase;
  }

  async findAll(
    options: FindIceCreamPurchasesOptions,
  ): Promise<PaginatedResult<IceCreamPurchase>> {
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
      items: orms.map((orm) => IceCreamPurchaseMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<IceCreamPurchase | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: { iceCream: true } },
    });
    return orm ? IceCreamPurchaseMapper.toDomain(orm) : null;
  }

  private translatePurchaseError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, iceCreamId] = message.split(':');

    switch (code) {
      case 'PURCHASE_EMPTY':
        return new IceCreamPurchaseEmptyError();
      case 'SUPPLIER_NOT_FOUND':
      case 'SUPPLIER_INACTIVE':
        return new InvalidIceCreamSupplierError();
      case 'ICE_CREAM_NOT_FOUND':
        return new IceCreamNotFoundError(iceCreamId);
      case 'ICE_CREAM_INACTIVE':
        return new IceCreamInactiveError(iceCreamId);
      case 'INVALID_QUANTITY':
        return new InvalidIceCreamQuantityError(iceCreamId);
      case 'INVALID_PRICE':
        return new InvalidIceCreamPriceError(iceCreamId);
      default:
        return error;
    }
  }
}
