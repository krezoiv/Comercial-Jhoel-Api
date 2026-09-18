import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';

/**
 * Único case-insensitive entre filas activas para `name`/`slug` — mismo
 * escape hatch `LOWER(...) WHERE is_active` de `presentation_types`/`clients`
 * (TypeORM no puede expresar un índice funcional vía decorador).
 */
@Entity('news_types')
export class NewsTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column({ name: 'is_wildcard', default: false })
  isWildcard: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
