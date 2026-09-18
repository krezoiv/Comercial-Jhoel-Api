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

/** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente. */
@Entity('catalog_banks')
export class CatalogBankOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ name: 'image_data', type: 'bytea', nullable: true, select: false })
  imageData: Buffer | null;

  @Column({ name: 'image_mime_type', type: 'varchar', length: 50, nullable: true })
  imageMimeType: string | null;

  @Column({ name: 'image_size_bytes', type: 'integer', nullable: true })
  imageSizeBytes: number | null;

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
