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
}
