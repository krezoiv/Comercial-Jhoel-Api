import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { NewsType } from '../../domain/entities/news-type.entity';
import {
  CreateNewsTypeData,
  FindNewsTypesOptions,
  NewsTypeListItem,
  NewsTypeRepository,
  ReorderNewsTypeItem,
  UpdateNewsTypeData,
} from '../../domain/repositories/news-type.repository';
import { NewsTypeNameAlreadyExistsError } from '../../domain/errors/news-type-name-already-exists.error';
import { NewsTypeOrmEntity } from './news-type.orm-entity';
import { NewsTypeMapper } from './news-type.mapper';

@Injectable()
export class TypeOrmNewsTypeRepository implements NewsTypeRepository {
  constructor(
    @InjectRepository(NewsTypeOrmEntity)
    private readonly repository: Repository<NewsTypeOrmEntity>,
  ) {}

  /** Correlated scalar subquery para `usageCount` — nunca un join (fanearía filas), mismo patrón que `TypeOrmPresentationTypeRepository.findAll`. */
  async findAll(options: FindNewsTypesOptions): Promise<NewsTypeListItem[]> {
    const qb = this.repository
      .createQueryBuilder('newsType')
      .leftJoin('newsType.createdByUser', 'createdByUser')
      .leftJoin('newsType.updatedByUser', 'updatedByUser');

    if (options.activeOnly) {
      qb.andWhere('newsType.isActive = true');
    }
    if (options.search) {
      qb.andWhere('search_normalize(newsType.name) LIKE search_normalize(:search)', { search: `%${options.search}%` });
    }

    qb.select('newsType.id', 'id')
      .addSelect('newsType.name', 'name')
      .addSelect('newsType.slug', 'slug')
      .addSelect('newsType.description', 'description')
      .addSelect('newsType.isWildcard', 'isWildcard')
      .addSelect('newsType.isActive', 'isActive')
      .addSelect('newsType.sortOrder', 'sortOrder')
      .addSelect('newsType.createdAt', 'createdAt')
      .addSelect('newsType.updatedAt', 'updatedAt')
      .addSelect('newsType.createdBy', 'createdBy')
      .addSelect('createdByUser.username', 'createdByUsername')
      .addSelect('newsType.updatedBy', 'updatedBy')
      .addSelect('updatedByUser.username', 'updatedByUsername')
      .addSelect(
        (subQb) =>
          subQb
            .select('COUNT(*)', 'count')
            .from('news_articles', 'na')
            .where('na.news_type_id = newsType.id'),
        'usageCount',
      )
      .orderBy('newsType.sortOrder', 'ASC')
      .addOrderBy('newsType.name', 'ASC');

    const rows = await qb.getRawMany<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      isWildcard: boolean;
      isActive: boolean;
      sortOrder: number;
      createdAt: Date;
      updatedAt: Date;
      createdBy: string;
      createdByUsername: string | null;
      updatedBy: string | null;
      updatedByUsername: string | null;
      usageCount: string;
    }>();

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      isWildcard: row.isWildcard,
      isActive: row.isActive,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdBy: row.createdBy,
      createdByUsername: row.createdByUsername ?? '',
      updatedBy: row.updatedBy,
      updatedByUsername: row.updatedByUsername,
      usageCount: parseInt(row.usageCount, 10),
    }));
  }

  async findById(id: string): Promise<NewsType | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? NewsTypeMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<NewsType | null> {
    const orm = await this.repository
      .createQueryBuilder('newsType')
      .where('LOWER(newsType.name) = LOWER(:name)', { name })
      .andWhere('newsType.isActive = true')
      .getOne();
    return orm ? NewsTypeMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<NewsType | null> {
    const orm = await this.repository
      .createQueryBuilder('newsType')
      .where('LOWER(newsType.name) = LOWER(:name)', { name })
      .getOne();
    return orm ? NewsTypeMapper.toDomain(orm) : null;
  }

  async findBySlug(slug: string): Promise<NewsType | null> {
    const orm = await this.repository
      .createQueryBuilder('newsType')
      .where('LOWER(newsType.slug) = LOWER(:slug)', { slug })
      .getOne();
    return orm ? NewsTypeMapper.toDomain(orm) : null;
  }

  async findWildcard(): Promise<NewsType | null> {
    const orm = await this.repository.findOne({ where: { isWildcard: true, isActive: true } });
    return orm ? NewsTypeMapper.toDomain(orm) : null;
  }

  async create(data: CreateNewsTypeData): Promise<NewsType> {
    const orm = this.repository.create({
      name: data.name,
      slug: data.slug,
      description: data.description,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({ where: { id: saved.id } });
      return NewsTypeMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateNewsTypeData): Promise<NewsType> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return NewsTypeMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  async reorder(items: ReorderNewsTypeItem[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const item of items) {
        await manager.update(NewsTypeOrmEntity, { id: item.id }, { sortOrder: item.sortOrder });
      }
    });
  }

  async countUsage(id: string): Promise<number> {
    const [row] = await this.repository.manager.query<{ count: string }[]>(
      'SELECT COUNT(*) AS count FROM news_articles WHERE news_type_id = $1',
      [id],
    );
    return parseInt(row?.count ?? '0', 10);
  }

  private translateUniqueViolation(error: unknown, name: string): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (error.driverError as { constraint?: string } | undefined)?.constraint;
      if (constraint === 'UQ_news_types_name_active' || constraint === 'UQ_news_types_slug_active') {
        return new NewsTypeNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
