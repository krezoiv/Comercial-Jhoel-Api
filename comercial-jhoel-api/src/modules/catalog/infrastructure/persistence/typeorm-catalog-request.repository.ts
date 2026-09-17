import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogRequest } from '../../domain/entities/catalog-request.entity';
import {
  CatalogRequestRepository,
  CreateCatalogRequestData,
  ListCatalogRequestsOptions,
  UpdateCatalogRequestStatusData,
} from '../../domain/repositories/catalog-request.repository';
import { CatalogRequestStatus } from '../../domain/entities/catalog-request.entity';
import { CatalogRequestOrmEntity } from './catalog-request.orm-entity';
import { CatalogRequestMapper } from './catalog-request.mapper';

@Injectable()
export class TypeOrmCatalogRequestRepository implements CatalogRequestRepository {
  constructor(
    @InjectRepository(CatalogRequestOrmEntity)
    private readonly repository: Repository<CatalogRequestOrmEntity>,
  ) {}

  async findAll(
    options?: ListCatalogRequestsOptions,
  ): Promise<CatalogRequest[]> {
    const query = this.repository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.updatedByUser', 'updatedByUser')
      .orderBy('request.createdAt', 'DESC');

    if (options?.status) {
      query.andWhere('request.status = :status', { status: options.status });
    }
    if (options?.requestType) {
      query.andWhere('request.requestType = :requestType', {
        requestType: options.requestType,
      });
    }
    if (options?.startDate) {
      query.andWhere('request.createdAt >= :startDate', {
        startDate: options.startDate,
      });
    }
    if (options?.endDate) {
      query.andWhere('request.createdAt <= :endDate', {
        endDate: options.endDate,
      });
    }

    const orms = await query.getMany();
    return orms.map((orm) => CatalogRequestMapper.toDomain(orm));
  }

  async findById(id: string): Promise<CatalogRequest | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? CatalogRequestMapper.toDomain(orm) : null;
  }

  async create(data: CreateCatalogRequestData): Promise<CatalogRequest> {
    const orm = this.repository.create({
      catalogPhoneId: data.catalogPhoneId,
      brand: data.brand,
      model: data.model,
      price: data.price,
      creditAvailable: data.creditAvailable,
      requestType: data.requestType,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      status: 'NUEVA' as CatalogRequestStatus,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);

    return withRelations!;
  }

  async updateStatus(
    id: string,
    data: UpdateCatalogRequestStatusData,
  ): Promise<CatalogRequest> {
    const patch: Partial<CatalogRequestOrmEntity> = {
      status: data.status,
      updatedBy: data.updatedBy,
    };
    if (data.observation !== undefined) {
      patch.observation = data.observation;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);

    return updated!;
  }

  async countByStatus(status: CatalogRequestStatus): Promise<number> {
    return this.repository.count({ where: { status } });
  }
}
