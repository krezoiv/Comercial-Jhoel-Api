import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogProductRequest } from '../../domain/entities/catalog-product-request.entity';
import {
  CatalogProductRequestRepository,
  CreateCatalogProductRequestData,
  ListCatalogProductRequestsOptions,
  UpdateCatalogProductRequestStatusData,
} from '../../domain/repositories/catalog-product-request.repository';
import { CatalogProductRequestOrmEntity } from './catalog-product-request.orm-entity';
import { CatalogProductRequestMapper } from './catalog-product-request.mapper';

@Injectable()
export class TypeOrmCatalogProductRequestRepository
  implements CatalogProductRequestRepository
{
  constructor(
    @InjectRepository(CatalogProductRequestOrmEntity)
    private readonly repository: Repository<CatalogProductRequestOrmEntity>,
  ) {}

  async findAll(
    options?: ListCatalogProductRequestsOptions,
  ): Promise<CatalogProductRequest[]> {
    const query = this.repository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.updatedByUser', 'updatedByUser')
      .orderBy('request.createdAt', 'DESC');

    if (options?.status) {
      query.andWhere('request.status = :status', { status: options.status });
    }
    if (options?.startDate) {
      query.andWhere('request.createdAt >= :startDate', { startDate: options.startDate });
    }
    if (options?.endDate) {
      query.andWhere('request.createdAt <= :endDate', { endDate: options.endDate });
    }

    const orms = await query.getMany();
    return orms.map((orm) => CatalogProductRequestMapper.toDomain(orm));
  }

  async findById(id: string): Promise<CatalogProductRequest | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? CatalogProductRequestMapper.toDomain(orm) : null;
  }

  async create(data: CreateCatalogProductRequestData): Promise<CatalogProductRequest> {
    const orm = this.repository.create({
      catalogProductId: data.catalogProductId,
      productName: data.productName,
      price: data.price,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      status: 'NUEVA',
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return withRelations!;
  }

  async updateStatus(
    id: string,
    data: UpdateCatalogProductRequestStatusData,
  ): Promise<CatalogProductRequest> {
    const patch: Partial<CatalogProductRequestOrmEntity> = {
      status: data.status,
      updatedBy: data.updatedBy,
    };
    if (data.observation !== undefined) {
      patch.observation = data.observation;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updated!;
  }
}
