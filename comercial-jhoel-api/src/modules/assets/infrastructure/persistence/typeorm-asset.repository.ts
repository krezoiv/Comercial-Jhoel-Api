import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from '../../domain/entities/asset.entity';
import {
  AssetRepository,
  AssetSortField,
  AssetsReportSummary,
  CreateAssetData,
  FindAssetsOptions,
  FindAssetsReportSummaryOptions,
  PaginatedResult,
  UpdateAssetData,
} from '../../domain/repositories/asset.repository';
import { AssetOrmEntity } from './asset.orm-entity';
import { AssetMapper } from './asset.mapper';

const SORT_COLUMN: Record<AssetSortField, string> = {
  date: 'record.date',
  amount: 'record.amount',
  createdAt: 'record.createdAt',
};

@Injectable()
export class TypeOrmAssetRepository implements AssetRepository {
  constructor(
    @InjectRepository(AssetOrmEntity)
    private readonly repository: Repository<AssetOrmEntity>,
  ) {}

  async findAll(options: FindAssetsOptions): Promise<PaginatedResult<Asset>> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.client', 'client')
      .leftJoinAndSelect('record.createdByUser', 'createdByUser')
      .leftJoinAndSelect('record.updatedByUser', 'updatedByUser');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.minAmount !== undefined) {
      qb.andWhere('record.amount >= :minAmount', {
        minAmount: options.minAmount,
      });
    }
    if (options.maxAmount !== undefined) {
      qb.andWhere('record.amount <= :maxAmount', {
        maxAmount: options.maxAmount,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(record.description ILIKE :search OR client.name ILIKE :search)',
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
      items: orms.map((orm) => AssetMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  /** A real SQL aggregate — never an in-memory sum over one fetched page, which would silently undercount whatever didn't fit the page (see Reports' own `getSummary()` lesson for Sales/Purchases). */
  async getReportSummary(
    options: FindAssetsReportSummaryOptions,
  ): Promise<AssetsReportSummary> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoin('record.client', 'client');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.search) {
      qb.andWhere(
        '(record.description ILIKE :search OR client.name ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }

    const raw = await qb
      .select('COUNT(*)', 'recordCount')
      .addSelect('COALESCE(SUM(record.amount), 0)', 'totalAmount')
      .getRawOne<{ recordCount: string; totalAmount: string }>();

    return {
      recordCount: Number(raw?.recordCount ?? 0),
      totalAmount: Number(raw?.totalAmount ?? 0),
    };
  }

  async findById(id: string): Promise<Asset | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? AssetMapper.toDomain(orm) : null;
  }

  async create(data: CreateAssetData): Promise<Asset> {
    const orm = this.repository.create(data);
    const saved = await this.repository.save(orm);
    const withRelations = await this.repository.findOneOrFail({
      where: { id: saved.id },
    });
    return AssetMapper.toDomain(withRelations);
  }

  async update(id: string, data: UpdateAssetData): Promise<Asset> {
    await this.repository.update({ id }, data);
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return AssetMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }
}
