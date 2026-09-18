import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CatalogLikeEntityType,
  CatalogLikeRepository,
} from '../../domain/repositories/catalog-like.repository';
import { CatalogLikeOrmEntity } from './catalog-like.orm-entity';

@Injectable()
export class TypeOrmCatalogLikeRepository implements CatalogLikeRepository {
  constructor(
    @InjectRepository(CatalogLikeOrmEntity)
    private readonly repository: Repository<CatalogLikeOrmEntity>,
  ) {}

  async like(
    entityType: CatalogLikeEntityType,
    entityId: string,
    visitorId: string,
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .values({ entityType, entityId, visitorId })
      .orIgnore()
      .execute();
  }

  async unlike(
    entityType: CatalogLikeEntityType,
    entityId: string,
    visitorId: string,
  ): Promise<void> {
    await this.repository.delete({ entityType, entityId, visitorId });
  }

  async getCount(entityType: CatalogLikeEntityType, entityId: string): Promise<number> {
    return this.repository.count({ where: { entityType, entityId } });
  }

  async getCountsBatch(
    entityType: CatalogLikeEntityType,
    entityIds: string[],
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();
    if (entityIds.length === 0) {
      return counts;
    }
    const rows: Array<{ entity_id: string; count: string }> = await this.repository.manager.query(
      `SELECT entity_id, COUNT(*) AS count FROM catalog_likes WHERE entity_type = $1 AND entity_id = ANY($2::uuid[]) GROUP BY entity_id`,
      [entityType, entityIds],
    );
    for (const row of rows) {
      counts.set(row.entity_id, Number(row.count));
    }
    return counts;
  }

  async getLikedEntityIds(
    entityType: CatalogLikeEntityType,
    visitorId: string,
    entityIds: string[],
  ): Promise<Set<string>> {
    if (entityIds.length === 0) {
      return new Set();
    }
    const rows: Array<{ entity_id: string }> = await this.repository.manager.query(
      `SELECT entity_id FROM catalog_likes WHERE entity_type = $1 AND visitor_id = $2 AND entity_id = ANY($3::uuid[])`,
      [entityType, visitorId, entityIds],
    );
    return new Set(rows.map((row) => row.entity_id));
  }
}
