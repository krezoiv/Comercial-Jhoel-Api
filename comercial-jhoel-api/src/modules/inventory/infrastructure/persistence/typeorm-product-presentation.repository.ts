import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import {
  CreatePresentationData,
  ProductPresentationRepository,
  UpdatePresentationData,
} from '../../domain/repositories/product-presentation.repository';
import { PresentationNameAlreadyExistsError } from '../../domain/errors/presentation.errors';
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

  async create(data: CreatePresentationData): Promise<ProductPresentation> {
    const orm = this.repository.create({
      productId: data.productId,
      presentationTypeId: data.presentationTypeId,
      conversionFactor: data.conversionFactor,
      costPrice: data.costPrice,
      publicPrice: data.publicPrice,
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
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateError(error);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return presentationToDomain(updated);
  }

  private translateError(error: unknown): unknown {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { constraint?: string } | undefined)?.constraint ===
        'UQ_product_presentations_product_type_active'
    ) {
      return new PresentationNameAlreadyExistsError();
    }
    return error;
  }
}
