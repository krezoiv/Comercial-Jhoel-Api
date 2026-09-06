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

// Uniqueness (`UQ_keyboard_shortcuts_combo_active`, case-insensitive on
// `key`) and the modifier/route CHECKs are created via raw SQL in the
// migration — TypeORM's `@Index`/`@Check` decorators can't express a
// `LOWER(...)` expression index, same reasoning `PresentationTypeOrmEntity`
// already documents for its own case-insensitive uniqueness.
@Entity('keyboard_shortcuts')
export class KeyboardShortcutOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  label: string;

  @Column({ type: 'varchar', length: 20 })
  key: string;

  @Column({ name: 'alt_key', default: false })
  altKey: boolean;

  @Column({ name: 'ctrl_key', default: false })
  ctrlKey: boolean;

  @Column({ name: 'shift_key', default: false })
  shiftKey: boolean;

  @Column({ name: 'meta_key', default: false })
  metaKey: boolean;

  @Column({ type: 'varchar', length: 200 })
  route: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
