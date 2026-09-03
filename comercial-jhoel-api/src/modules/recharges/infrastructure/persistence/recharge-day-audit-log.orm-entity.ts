import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('recharge_day_audit_logs')
export class RechargeDayAuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 30 })
  action: string;

  @Column({ name: 'performed_by' })
  performedBy: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'performed_by' })
  performedByUser: UserOrmEntity;

  @Column({ name: 'performed_at', type: 'timestamptz', default: () => 'now()' })
  performedAt: Date;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'previous_status', type: 'varchar', length: 30, nullable: true })
  previousStatus: string | null;

  @Column({ name: 'new_status', type: 'varchar', length: 30, nullable: true })
  newStatus: string | null;
}
