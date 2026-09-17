import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CatalogProduct, CatalogProductSection } from '../../domain/entities/catalog-product.entity';
import {
  CatalogProductImageBytes,
  CatalogProductRepository,
  CreateCatalogProductData,
  ListCatalogProductsOptions,
  ReorderCatalogProductItem,
  UpdateCatalogProductData,
} from '../../domain/repositories/catalog-product.repository';
import { CatalogProductOrmEntity } from './catalog-product.orm-entity';
import { CatalogProductMapper } from './catalog-product.mapper';

@Injectable()
export class TypeOrmCatalogProductRepository implements CatalogProductRepository {
  constructor(
    @InjectRepository(CatalogProductOrmEntity)
    private readonly repository: Repository<CatalogProductOrmEntity>,
  ) {}

  private baseQuery(): SelectQueryBuilder<CatalogProductOrmEntity> {
    return this.repository
      .createQueryBuilder('cp')
      .leftJoinAndSelect('cp.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.business', 'business')
      .leftJoinAndSelect('product.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('cp.createdByUser', 'createdByUser')
      .leftJoinAndSelect('cp.updatedByUser', 'updatedByUser');
  }

  async findAll(options: ListCatalogProductsOptions): Promise<CatalogProduct[]> {
    const query = this.baseQuery().andWhere('cp.section = :section', {
      section: options.section,
    });
    if (!options.includeInactive) {
      query.andWhere('cp.isActive = true');
    }
    if (options.search) {
      query.andWhere('(product.name ILIKE :search OR product.sku ILIKE :search)', {
        search: `%${options.search}%`,
      });
    }
    query.orderBy('cp.sortOrder', 'ASC').addOrderBy('cp.createdAt', 'DESC');
    const orms = await query.getMany();
    return orms.map((orm) => CatalogProductMapper.toDomain(orm));
  }

  async findById(id: string): Promise<CatalogProduct | null> {
    const orm = await this.baseQuery().andWhere('cp.id = :id', { id }).getOne();
    return orm ? CatalogProductMapper.toDomain(orm) : null;
  }

  async findPublished(section: CatalogProductSection): Promise<CatalogProduct[]> {
    const orms = await this.baseQuery()
      .andWhere('cp.section = :section', { section })
      .andWhere('cp.isActive = true')
      .andWhere('product.isActive = true')
      .orderBy('cp.sortOrder', 'ASC')
      .getMany();
    return orms.map((orm) => CatalogProductMapper.toDomain(orm));
  }

  async findByProductAndSection(
    productId: string,
    section: CatalogProductSection,
  ): Promise<CatalogProduct | null> {
    const orm = await this.baseQuery()
      .andWhere('cp.productId = :productId', { productId })
      .andWhere('cp.section = :section', { section })
      .getOne();
    return orm ? CatalogProductMapper.toDomain(orm) : null;
  }

  async create(data: CreateCatalogProductData): Promise<CatalogProduct> {
    const orm = this.repository.create({
      productId: data.productId,
      section: data.section,
      catalogDescription: data.catalogDescription,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return withRelations!;
  }

  async update(id: string, data: UpdateCatalogProductData): Promise<CatalogProduct> {
    const patch: Partial<CatalogProductOrmEntity> = { updatedBy: data.updatedBy };
    if (data.catalogDescription !== undefined) {
      patch.catalogDescription = data.catalogDescription;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updated!;
  }

  async setActive(id: string, isActive: boolean, updatedBy: string): Promise<void> {
    await this.repository.update({ id }, { isActive, updatedBy });
  }

  async reorder(items: ReorderCatalogProductItem[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const item of items) {
        await manager.update(CatalogProductOrmEntity, { id: item.id }, {
          sortOrder: item.sortOrder,
        });
      }
    });
  }

  async setImage(
    id: string,
    image: { data: Buffer; mimeType: string; sizeBytes: number },
    updatedBy: string,
  ): Promise<void> {
    await this.repository.update(
      { id },
      {
        imageData: image.data,
        imageMimeType: image.mimeType,
        imageSizeBytes: image.sizeBytes,
        updatedBy,
      },
    );
  }

  async removeImage(id: string, updatedBy: string): Promise<void> {
    await this.repository.update(
      { id },
      { imageData: null, imageMimeType: null, imageSizeBytes: null, updatedBy },
    );
  }

  async getImage(id: string): Promise<CatalogProductImageBytes | null> {
    const orm = await this.repository
      .createQueryBuilder('cp')
      .select(['cp.id', 'cp.imageData', 'cp.imageMimeType'])
      .where('cp.id = :id', { id })
      .getOne();
    if (!orm || !orm.imageData || !orm.imageMimeType) {
      return null;
    }
    return { data: orm.imageData, mimeType: orm.imageMimeType, catalogProductId: orm.id };
  }
}
