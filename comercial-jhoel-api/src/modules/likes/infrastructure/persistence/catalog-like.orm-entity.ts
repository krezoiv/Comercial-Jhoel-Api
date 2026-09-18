import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('catalog_likes')
export class CatalogLikeOrmEntity {
  @PrimaryColumn({ name: 'entity_type', type: 'varchar', length: 20 })
  entityType: string;

  @PrimaryColumn({ name: 'entity_id', type: 'uuid' })
  entityId: string;

  @PrimaryColumn({ name: 'visitor_id', type: 'uuid' })
  visitorId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
