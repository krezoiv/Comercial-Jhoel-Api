import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NewsArticle } from '../../domain/entities/news-article.entity';
import {
  CreateNewsArticleData,
  ListNewsArticlesOptions,
  NewsArticleImageBytes,
  NewsArticleRepository,
  ReorderNewsArticleItem,
  UpdateNewsArticleData,
} from '../../domain/repositories/news-article.repository';
import { NewsArticleOrmEntity } from './news-article.orm-entity';
import { NewsArticleMapper } from './news-article.mapper';

@Injectable()
export class TypeOrmNewsArticleRepository implements NewsArticleRepository {
  constructor(
    @InjectRepository(NewsArticleOrmEntity)
    private readonly repository: Repository<NewsArticleOrmEntity>,
  ) {}

  private baseQuery(): SelectQueryBuilder<NewsArticleOrmEntity> {
    return this.repository
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.createdByUser', 'createdByUser')
      .leftJoinAndSelect('n.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('n.newsType', 'newsType');
  }

  async findAll(options?: ListNewsArticlesOptions): Promise<NewsArticle[]> {
    const query = this.baseQuery();
    if (!options?.includeInactive) {
      query.andWhere('n.isActive = true');
    }
    if (options?.search) {
      query.andWhere('n.title ILIKE :search', { search: `%${options.search}%` });
    }
    query.orderBy('n.sortOrder', 'ASC').addOrderBy('n.publishedAt', 'DESC');
    const orms = await query.getMany();
    return orms.map((orm) => NewsArticleMapper.toDomain(orm));
  }

  async findById(id: string): Promise<NewsArticle | null> {
    const orm = await this.baseQuery().andWhere('n.id = :id', { id }).getOne();
    return orm ? NewsArticleMapper.toDomain(orm) : null;
  }

  async findBySlug(slug: string): Promise<NewsArticle | null> {
    const orm = await this.baseQuery().andWhere('n.slug = :slug', { slug }).getOne();
    return orm ? NewsArticleMapper.toDomain(orm) : null;
  }

  async findPublished(): Promise<NewsArticle[]> {
    const orms = await this.baseQuery()
      .andWhere('n.isActive = true')
      .orderBy('n.sortOrder', 'ASC')
      .addOrderBy('n.publishedAt', 'DESC')
      .getMany();
    return orms.map((orm) => NewsArticleMapper.toDomain(orm));
  }

  async findPublishedBySlug(slug: string): Promise<NewsArticle | null> {
    const orm = await this.baseQuery()
      .andWhere('n.slug = :slug', { slug })
      .andWhere('n.isActive = true')
      .getOne();
    return orm ? NewsArticleMapper.toDomain(orm) : null;
  }

  async create(data: CreateNewsArticleData): Promise<NewsArticle> {
    const orm = this.repository.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      publishedAt: data.publishedAt,
      newsTypeId: data.newsTypeId,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return withRelations!;
  }

  async update(id: string, data: UpdateNewsArticleData): Promise<NewsArticle> {
    const patch: Partial<NewsArticleOrmEntity> = { updatedBy: data.updatedBy };
    if (data.title !== undefined) {
      patch.title = data.title;
    }
    if (data.description !== undefined) {
      patch.description = data.description;
    }
    if (data.publishedAt !== undefined) {
      patch.publishedAt = data.publishedAt;
    }
    if (data.newsTypeId !== undefined) {
      patch.newsTypeId = data.newsTypeId;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updated!;
  }

  async setActive(id: string, isActive: boolean, updatedBy: string): Promise<void> {
    await this.repository.update({ id }, { isActive, updatedBy });
  }

  async reorder(items: ReorderNewsArticleItem[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const item of items) {
        await manager.update(NewsArticleOrmEntity, { id: item.id }, {
          sortOrder: item.sortOrder,
        });
      }
    });
  }

  async adjustLikes(id: string, delta: number): Promise<number> {
    // `manager.query()` for an UPDATE ... RETURNING returns a `[rows, affectedCount]` tuple
    // in this driver, not a bare rows array — confirmed directly, not assumed.
    const [rows]: [Array<{ likes_count: number }>, number] = await this.repository.manager.query(
      `UPDATE news_articles SET likes_count = GREATEST(0, likes_count + $1) WHERE id = $2 RETURNING likes_count`,
      [delta, id],
    );
    return rows[0]?.likes_count ?? 0;
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

  async getImage(id: string): Promise<NewsArticleImageBytes | null> {
    const orm = await this.repository
      .createQueryBuilder('n')
      .select(['n.id', 'n.imageData', 'n.imageMimeType'])
      .where('n.id = :id', { id })
      .getOne();
    if (!orm || !orm.imageData || !orm.imageMimeType) {
      return null;
    }
    return { data: orm.imageData, mimeType: orm.imageMimeType };
  }
}
