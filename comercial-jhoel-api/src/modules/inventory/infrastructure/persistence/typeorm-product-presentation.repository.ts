import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import {
  CreatePresentationData,
  ProductPresentationRepository,
  UpdatePresentationData,
} from '../../domain/repositories/product-presentation.repository';
import {
  PresentationBarcodeAlreadyExistsError,
  PresentationNameAlreadyExistsError,
} from '../../domain/errors/presentation.errors';
import { ProductPresentationOrmEntity } from './product-presentation.orm-entity';
import { presentationToDomain } from './inventory.mappers';

@Injectable()
export class TypeOrmProductPresentationRepository implements ProductPresentationRepository {
  constructor(
    @InjectRepository(ProductPresentationOrmEntity)
    private readonly repository: Repository<ProductPresentationOrmEntity>,
  ) {}

  async findByProductId(
    productId: string,
    options?: { activeOnly?: boolean },
  ): Promise<ProductPresentation[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly
        ? { productId, isActive: true }
        : { productId },
      order: { conversionFactor: 'ASC' },
    });
    return orms.map(presentationToDomain);
  }

  async findById(id: string): Promise<ProductPresentation | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? presentationToDomain(orm) : null;
  }

  /**
   * Scoped to presentations whose PARENT PRODUCT is also active, not just
   * the presentation row itself — deactivating a product never cascades to
   * deactivate its own presentations (a deliberate, separate lifecycle), so
   * without this join a barcode left behind by a deactivated product's
   * still-"active" presentation would permanently block reuse of that
   * barcode even though nothing scannable is actually using it anymore.
   * No `ProductOrmEntity` relation exists on this entity, so this joins the
   * `products` table directly by raw condition.
   */
  async findActiveByBarcode(barcode: string): Promise<ProductPresentation | null> {
    const orm = await this.repository
      .createQueryBuilder('presentation')
      .leftJoinAndSelect('presentation.presentationType', 'presentationType')
      .innerJoin('products', 'product', 'product.id = presentation.productId')
      .where('presentation.barcode = :barcode', { barcode })
      .andWhere('presentation.isActive = true')
      .andWhere('product.isActive = true')
      .getOne();
    return orm ? presentationToDomain(orm) : null;
  }

  async create(data: CreatePresentationData): Promise<ProductPresentation> {
    const orm = this.repository.create({
      productId: data.productId,
      presentationTypeId: data.presentationTypeId,
      conversionFactor: data.conversionFactor,
      costPrice: data.costPrice,
      publicPrice: data.publicPrice,
      barcode: data.barcode?.trim() || null,
    });
    try {
      const saved = await this.repository.save(orm);
      // `.save()` never populates the eager `presentationType` relation on
      // the object it returns — same gotcha `TypeOrmUserRepository.create()`
      // already works around — so the display name would come back empty
      // without this re-fetch.
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return presentationToDomain(withRelations);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async update(
    id: string,
    data: UpdatePresentationData,
  ): Promise<ProductPresentation> {
    try {
      await this.repository.update(
        { id },
        {
          ...data,
          barcode:
            data.barcode === undefined ? undefined : data.barcode?.trim() || null,
        },
      );
    } catch (error) {
      throw this.translateError(error);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return presentationToDomain(updated);
  }

  async findMatchingByBarcode(
    productIds: string[],
    search: string,
  ): Promise<Map<string, ProductPresentation>> {
    const map = new Map<string, ProductPresentation>();
    const trimmed = search.trim();
    if (productIds.length === 0 || !trimmed) {
      return map;
    }
    const orms = await this.repository
      .createQueryBuilder('presentation')
      .leftJoinAndSelect('presentation.presentationType', 'presentationType')
      .where('presentation.productId IN (:...productIds)', { productIds })
      .andWhere('presentation.isActive = true')
      .andWhere('presentation.barcode ILIKE :search', { search: `%${trimmed}%` })
      .getMany();
    for (const orm of orms) {
      if (!map.has(orm.productId)) {
        map.set(orm.productId, presentationToDomain(orm));
      }
    }
    return map;
  }

  async deactivateAllForProduct(productId: string): Promise<void> {
    await this.repository.update({ productId, isActive: true }, { isActive: false });
  }

  private translateError(error: unknown): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (error.driverError as { constraint?: string } | undefined)
        ?.constraint;
      if (constraint === 'UQ_product_presentations_product_type_active') {
        return new PresentationNameAlreadyExistsError();
      }
      if (constraint === 'UQ_product_presentations_barcode_active') {
        return new PresentationBarcodeAlreadyExistsError();
      }
    }
    return error;
  }
}
