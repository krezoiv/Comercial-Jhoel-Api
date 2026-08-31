import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

@Entity('day_openings')
export class DayOpeningOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'opened_by' })
  openedBy: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'opened_by' })
  openedByUser: UserOrmEntity;

  @Column({ name: 'opened_at', type: 'timestamptz', default: () => 'now()' })
  openedAt: Date;

  @Column({ name: 'closed_at', type: 'timestamptz', nullable: true })
  closedAt: Date | null;

  @Column({ name: 'closed_by', nullable: true })
  closedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'closed_by' })
  closedByUser: UserOrmEntity | null;

  @Column({ name: 'reopened_at', type: 'timestamptz', nullable: true })
  reopenedAt: Date | null;

  @Column({ name: 'reopened_by', nullable: true })
  reopenedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'reopened_by' })
  reopenedByUser: UserOrmEntity | null;

  @Column({ name: 'reopen_reason', type: 'text', nullable: true })
  reopenReason: string | null;

  @Column({ name: 'is_cancelled', default: false })
  isCancelled: boolean;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'cancelled_by' })
  cancelledByUser: UserOrmEntity | null;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string | null;
}
