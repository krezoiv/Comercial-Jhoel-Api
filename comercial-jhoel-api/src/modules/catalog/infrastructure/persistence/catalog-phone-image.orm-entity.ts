import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatalogPhoneOrmEntity } from './catalog-phone.orm-entity';

@Entity('catalog_phone_images')
export class CatalogPhoneImageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_phone_id' })
  catalogPhoneId: string;

  @ManyToOne(() => CatalogPhoneOrmEntity, (phone) => phone.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'catalog_phone_id' })
  catalogPhone: CatalogPhoneOrmEntity;

  @Column({ name: 'image_data', type: 'bytea' })
  imageData: Buffer;

  @Column({ name: 'mime_type', type: 'varchar', length: 50 })
  mimeType: string;

  @Column({ name: 'size_bytes', type: 'integer' })
  sizeBytes: number;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
