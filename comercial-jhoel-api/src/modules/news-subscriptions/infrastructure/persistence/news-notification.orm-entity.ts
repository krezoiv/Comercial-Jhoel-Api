import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Cola de notificaciones — preparada para un futuro proveedor real de WhatsApp (ver el diagnóstico del plan: hoy no existe integración, así que todo queda en PENDING). */
@Entity('news_notifications')
export class NewsNotificationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'news_article_id', type: 'uuid' })
  newsArticleId: string;

  @Column({ name: 'subscriber_id', type: 'uuid' })
  subscriberId: string;

  @Column({ name: 'news_type_id', type: 'uuid' })
  newsTypeId: string;

  @Column({ name: 'message_preview', type: 'text' })
  messagePreview: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: 'PENDING' | 'SENT' | 'FAILED';

  @Column({ type: 'integer', default: 0 })
  attempts: number;

  @Column({ name: 'external_id', type: 'varchar', length: 100, nullable: true })
  externalId: string | null;

  @Column({ name: 'error_message', type: 'varchar', length: 500, nullable: true })
  errorMessage: string | null;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
