import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IceCreamSale } from '../../domain/entities/ice-cream-sale.entity';
import {
  ConfirmIceCreamSaleData,
  FindIceCreamSalesOptions,
  IceCreamSaleRepository,
  IceCreamSaleSortField,
  PaginatedResult,
} from '../../domain/repositories/ice-cream-sale.repository';
import { IceCreamSaleEmptyError } from '../../domain/errors/ice-cream-sale-empty.error';
import { IceCreamNotFoundError } from '../../domain/errors/ice-cream-not-found.error';
import { IceCreamInactiveError } from '../../domain/errors/ice-cream-inactive.error';
import { InvalidIceCreamQuantityError } from '../../domain/errors/invalid-ice-cream-quantity.error';
import { InsufficientIceCreamStockError } from '../../domain/errors/insufficient-ice-cream-stock.error';
import { IceCreamSaleOrmEntity } from './ice-cream-sale.orm-entity';
import { IceCreamSaleMapper } from './ice-cream-sale.mapper';

const SORT_COLUMN: Record<IceCreamSaleSortField, string> = {
  saleDate: 'sale.saleDate',
  total: 'sale.total',
  createdAt: 'sale.createdAt',
};

@Injectable()
export class TypeOrmIceCreamSaleRepository implements IceCreamSaleRepository {
  constructor(
    @InjectRepository(IceCreamSaleOrmEntity)
    private readonly repository: Repository<IceCreamSaleOrmEntity>,
  ) {}

  async confirmSale(data: ConfirmIceCreamSaleData): Promise<IceCreamSale> {
    const itemsJson = JSON.stringify(
      data.items.map((item) => ({
        iceCreamId: item.iceCreamId,
        quantity: item.quantity,
      })),
    );

    let saleId: string;
    try {
      const rows = await this.repository.manager.query<
        { confirm_ice_cream_sale: string }[]
      >('SELECT confirm_ice_cream_sale($1, $2::jsonb)', [
        data.userId,
        itemsJson,
      ]);
      saleId = rows[0].confirm_ice_cream_sale;
    } catch (error) {
      throw this.translateSaleError(error);
    }

    const sale = await this.findById(saleId);
    if (!sale) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la venta recién creada.',
      );
    }
    return sale;
  }

  async findAll(
    options: FindIceCreamSalesOptions,
  ): Promise<PaginatedResult<IceCreamSale>> {
    const qb = this.repository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.user', 'user');

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
      items: orms.map((orm) => IceCreamSaleMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<IceCreamSale | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { items: { iceCream: true } },
    });
    return orm ? IceCreamSaleMapper.toDomain(orm) : null;
  }

  /** Same `RAISE EXCEPTION '<CODE>:<iceCreamId>'` → domain-error translation pattern as `TypeOrmSaleRepository.translateSaleError` — see that method's own doc comment for why this parsing exists. */
  private translateSaleError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code, iceCreamId] = message.split(':');

    switch (code) {
      case 'SALE_EMPTY':
        return new IceCreamSaleEmptyError();
      case 'ICE_CREAM_NOT_FOUND':
        return new IceCreamNotFoundError(iceCreamId);
      case 'ICE_CREAM_INACTIVE':
        return new IceCreamInactiveError(iceCreamId);
      case 'INVALID_QUANTITY':
        return new InvalidIceCreamQuantityError(iceCreamId);
      case 'INSUFFICIENT_STOCK':
        return new InsufficientIceCreamStockError(iceCreamId);
      default:
        return error;
    }
  }
}
