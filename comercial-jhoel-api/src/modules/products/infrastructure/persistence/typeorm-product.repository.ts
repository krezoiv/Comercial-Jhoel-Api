import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import {
  CreateProductData,
  FindProductsOptions,
  PaginatedResult,
  ProductRepository,
  ProductSortField,
  UpdateProductData,
} from '../../domain/repositories/product.repository';
import { ProductNameAlreadyExistsError } from '../../domain/errors/product-name-already-exists.error';
import { ProductSkuAlreadyExistsError } from '../../domain/errors/product-sku-already-exists.error';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductMapper } from './product.mapper';

const SORT_COLUMN: Record<ProductSortField, string> = {
  name: 'product.name',
  costPrice: 'product.costPrice',
  publicPrice: 'product.publicPrice',
  wholesalePrice: 'product.wholesalePrice',
  stock: 'product.stock',
  createdAt: 'product.createdAt',
};

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(
    options: FindProductsOptions,
  ): Promise<PaginatedResult<Product>> {
    const qb = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.business', 'business');

    if (options.activeOnly) {
      qb.andWhere('product.isActive = true');
    }
    if (options.search) {
      qb.andWhere('(product.name ILIKE :search OR product.sku ILIKE :search)', {
        search: `%${options.search}%`,
      });
    }
    if (options.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: options.categoryId,
      });
    }
    if (options.businessId) {
      qb.andWhere('product.businessId = :businessId', {
        businessId: options.businessId,
      });
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      items: orms.map((orm) => ProductMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<Product | null> {
    const orm = await this.repository.findOne({
      where: { name, isActive: true },
    });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async findByActiveSku(sku: string): Promise<Product | null> {
    const orm = await this.repository.findOne({
      where: { sku, isActive: true },
    });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async create(data: CreateProductData): Promise<Product> {
    const orm = this.repository.create(data);
    try {
      const saved = await this.repository.save(orm);
      const withCategory = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return ProductMapper.toDomain(withCategory);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name, data.sku);
    }
  }

  async update(id: string, data: UpdateProductData): Promise<Product> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '', data.sku);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return ProductMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  private translateUniqueViolation(
    error: unknown,
    name: string,
    sku?: string | null,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_products_name_active') {
        return new ProductNameAlreadyExistsError(name);
      }
      if (constraint === 'UQ_products_sku_active' && sku) {
        return new ProductSkuAlreadyExistsError(sku);
      }
    }
    return error;
  }
}
