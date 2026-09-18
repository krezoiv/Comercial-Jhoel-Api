import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import type { NewsSubscriberAuditAction } from '../../domain/repositories/news-subscriber.repository';

/** Línea de tiempo de consentimiento/preferencias/cancelación — mismo patrón que `day_audit_logs`, no solo columnas `createdBy`/`updatedBy`. */
@Entity('news_subscriber_audit_log')
export class NewsSubscriberAuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscriber_id', type: 'uuid' })
  subscriberId: string;

  @Column({ type: 'varchar', length: 30 })
  action: NewsSubscriberAuditAction;

  @Column({ name: 'previous_type_ids', type: 'uuid', array: true, nullable: true })
  previousTypeIds: string[] | null;

  @Column({ name: 'new_type_ids', type: 'uuid', array: true, nullable: true })
  newTypeIds: string[] | null;

  @Column({ name: 'performed_by', type: 'uuid', nullable: true })
  performedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'performed_by' })
  performedByUser: UserOrmEntity | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
