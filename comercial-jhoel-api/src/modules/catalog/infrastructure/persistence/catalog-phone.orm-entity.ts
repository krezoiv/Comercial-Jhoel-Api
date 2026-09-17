import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { CatalogPhoneExtraSpec } from '../../domain/entities/catalog-phone.entity';
import { CatalogPhoneImageOrmEntity } from './catalog-phone-image.orm-entity';

@Entity('catalog_phones')
export class CatalogPhoneOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  brand: string;

  @Column({ type: 'varchar', length: 150 })
  model: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  screen: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ram: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  storage: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  camera: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  battery: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  processor: string | null;

  @Column({
    name: 'operating_system',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  operatingSystem: string | null;

  @Column({ name: 'extra_specs', type: 'jsonb', default: () => "'[]'" })
  extraSpecs: CatalogPhoneExtraSpec[];

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @OneToMany(() => CatalogPhoneImageOrmEntity, (image) => image.catalogPhone)
  images: CatalogPhoneImageOrmEntity[];

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

  @ManyToOne(() => UserOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
