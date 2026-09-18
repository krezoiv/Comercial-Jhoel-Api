import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

/** Relación M:N suscriptor↔tipo de noticia — PK compuesta, mismo idioma que `catalog_likes` (ver `modules/likes`). */
@Entity('news_subscriber_types')
export class NewsSubscriberTypeOrmEntity {
  @PrimaryColumn({ name: 'subscriber_id', type: 'uuid' })
  subscriberId: string;

  @PrimaryColumn({ name: 'news_type_id', type: 'uuid' })
  newsTypeId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
