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
import type { LandingSectionKey } from '../../domain/constants/landing-section-key';
import type {
  BackgroundPosition,
  BackgroundSize,
  DepthEffect,
  MovementMode,
  OverlayLevel,
  ParallaxIntensity,
} from '../../domain/constants/visual-config';

/** `imageData` usa `select: false` — mismo patrón que Teléfonos/Librería/Variedades/Noticias/Catálogo de Bancos: nunca viaja en un listado normal, solo `getImage()` la selecciona explícitamente. */
@Entity('landing_backgrounds')
export class LandingBackgroundOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'section_key', type: 'varchar', length: 40 })
  sectionKey: LandingSectionKey;

  @Column({ name: 'image_data', type: 'bytea', nullable: true, select: false })
  imageData: Buffer | null;

  @Column({ name: 'image_mime_type', type: 'varchar', length: 50, nullable: true })
  imageMimeType: string | null;

  @Column({ name: 'image_size_bytes', type: 'integer', nullable: true })
  imageSizeBytes: number | null;

  @Column({ type: 'smallint', default: 25 })
  opacity: number;

  @Column({ type: 'varchar', length: 10, default: 'medium' })
  overlay: OverlayLevel;

  @Column({ type: 'varchar', length: 20, default: 'center' })
  position: BackgroundPosition;

  @Column({ type: 'varchar', length: 10, default: 'large' })
  size: BackgroundSize;

  @Column({ name: 'depth_effect', type: 'varchar', length: 10, default: 'subtle' })
  depthEffect: DepthEffect;

  @Column({ type: 'varchar', length: 10, default: 'subtle' })
  parallax: ParallaxIntensity;

  @Column({ type: 'varchar', length: 12, default: 'scroll_mouse' })
  movement: MovementMode;

  @Column({ name: 'is_active', type: 'boolean', default: true })
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

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
