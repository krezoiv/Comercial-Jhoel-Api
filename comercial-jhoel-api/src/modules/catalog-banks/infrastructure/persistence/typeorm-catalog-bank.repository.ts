import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CatalogBank } from '../../domain/entities/catalog-bank.entity';
import {
  CatalogBankImageBytes,
  CatalogBankRepository,
  CreateCatalogBankData,
  ListCatalogBanksOptions,
  ReorderCatalogBankItem,
  UpdateCatalogBankData,
} from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankOrmEntity } from './catalog-bank.orm-entity';
import { CatalogBankMapper } from './catalog-bank.mapper';

@Injectable()
export class TypeOrmCatalogBankRepository implements CatalogBankRepository {
  constructor(
    @InjectRepository(CatalogBankOrmEntity)
    private readonly repository: Repository<CatalogBankOrmEntity>,
  ) {}

  private baseQuery(): SelectQueryBuilder<CatalogBankOrmEntity> {
    return this.repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.createdByUser', 'createdByUser')
      .leftJoinAndSelect('b.updatedByUser', 'updatedByUser');
  }

  async findAll(options?: ListCatalogBanksOptions): Promise<CatalogBank[]> {
    const query = this.baseQuery();
    if (!options?.includeInactive) {
      query.andWhere('b.isActive = true');
    }
    if (options?.search) {
      query.andWhere('search_normalize(b.name) LIKE search_normalize(:search)', { search: `%${options.search}%` });
    }
    query.orderBy('b.sortOrder', 'ASC').addOrderBy('b.name', 'ASC');
    const orms = await query.getMany();
    return orms.map((orm) => CatalogBankMapper.toDomain(orm));
  }

  async findById(id: string): Promise<CatalogBank | null> {
    const orm = await this.baseQuery().andWhere('b.id = :id', { id }).getOne();
    return orm ? CatalogBankMapper.toDomain(orm) : null;
  }

  async findPublished(): Promise<CatalogBank[]> {
    const orms = await this.baseQuery().andWhere('b.isActive = true').orderBy('b.sortOrder', 'ASC').getMany();
    return orms.map((orm) => CatalogBankMapper.toDomain(orm));
  }

  async create(data: CreateCatalogBankData): Promise<CatalogBank> {
    const orm = this.repository.create({
      name: data.name,
      description: data.description,
      additionalInfo: data.additionalInfo,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return withRelations!;
  }

  async update(id: string, data: UpdateCatalogBankData): Promise<CatalogBank> {
    const patch: Partial<CatalogBankOrmEntity> = { updatedBy: data.updatedBy };
    if (data.name !== undefined) {
      patch.name = data.name;
    }
    if (data.description !== undefined) {
      patch.description = data.description;
    }
    if (data.additionalInfo !== undefined) {
      patch.additionalInfo = data.additionalInfo;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updated!;
  }

  async setActive(id: string, isActive: boolean, updatedBy: string): Promise<void> {
    await this.repository.update({ id }, { isActive, updatedBy });
  }

  async reorder(items: ReorderCatalogBankItem[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const item of items) {
        await manager.update(CatalogBankOrmEntity, { id: item.id }, { sortOrder: item.sortOrder });
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

  async getImage(id: string): Promise<CatalogBankImageBytes | null> {
    const orm = await this.repository
      .createQueryBuilder('b')
      .select(['b.id', 'b.imageData', 'b.imageMimeType'])
      .where('b.id = :id', { id })
      .getOne();
    if (!orm || !orm.imageData || !orm.imageMimeType) {
      return null;
    }
    return { data: orm.imageData, mimeType: orm.imageMimeType };
  }
}
