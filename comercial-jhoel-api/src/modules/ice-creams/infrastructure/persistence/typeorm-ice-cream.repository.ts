import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { IceCream } from '../../domain/entities/ice-cream.entity';
import {
  CreateIceCreamData,
  FindIceCreamsOptions,
  IceCreamRepository,
  IceCreamSortField,
  PaginatedResult,
  UpdateIceCreamData,
} from '../../domain/repositories/ice-cream.repository';
import { IceCreamNameAlreadyExistsError } from '../../domain/errors/ice-cream-name-already-exists.error';
import { IceCreamSkuAlreadyExistsError } from '../../domain/errors/ice-cream-sku-already-exists.error';
import { IceCreamOrmEntity } from './ice-cream.orm-entity';
import { IceCreamMapper } from './ice-cream.mapper';

const SORT_COLUMN: Record<IceCreamSortField, string> = {
  product: 'iceCream.product',
  sku: 'iceCream.sku',
  costPrice: 'iceCream.costPrice',
  publicPrice: 'iceCream.publicPrice',
  stock: 'iceCream.stock',
  createdAt: 'iceCream.createdAt',
};

@Injectable()
export class TypeOrmIceCreamRepository implements IceCreamRepository {
  constructor(
    @InjectRepository(IceCreamOrmEntity)
    private readonly repository: Repository<IceCreamOrmEntity>,
  ) {}

  async findAll(
    options: FindIceCreamsOptions,
  ): Promise<PaginatedResult<IceCream>> {
    const qb = this.repository.createQueryBuilder('iceCream');

    if (options.activeOnly) {
      qb.andWhere('iceCream.isActive = true');
    }
    if (options.search) {
      qb.andWhere(
        '(iceCream.product ILIKE :search OR iceCream.sku ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      items: orms.map((orm) => IceCreamMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<IceCream | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? IceCreamMapper.toDomain(orm) : null;
  }

  async findByActiveSku(sku: string): Promise<IceCream | null> {
    const orm = await this.repository.findOne({
      where: { sku, isActive: true },
    });
    return orm ? IceCreamMapper.toDomain(orm) : null;
  }

  async findByActiveProduct(product: string): Promise<IceCream | null> {
    const orm = await this.repository.findOne({
      where: { product, isActive: true },
    });
    return orm ? IceCreamMapper.toDomain(orm) : null;
  }

  async create(data: CreateIceCreamData): Promise<IceCream> {
    const orm = this.repository.create({
      sku: data.sku,
      product: data.product,
      costPrice: data.costPrice,
      publicPrice: data.publicPrice,
      stock: data.stock,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return IceCreamMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.product, data.sku);
    }
  }

  async update(id: string, data: UpdateIceCreamData): Promise<IceCream> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(error, data.product ?? '', data.sku);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return IceCreamMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Same DB-level-uniqueness-as-race-safety-net pattern as `TypeOrmProductRepository`'s own `translateUniqueViolation` — the use case's pre-check is the primary guard, this is the backstop. */
  private translateUniqueViolation(
    error: unknown,
    product: string,
    sku?: string,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_ice_creams_product_active') {
        return new IceCreamNameAlreadyExistsError(product);
      }
      if (constraint === 'UQ_ice_creams_sku_active' && sku) {
        return new IceCreamSkuAlreadyExistsError(sku);
      }
    }
    return error;
  }
}
