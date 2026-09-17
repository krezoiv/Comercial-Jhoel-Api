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
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import type { CatalogProductRequestStatus } from '../../domain/entities/catalog-product-request.entity';

@Entity('catalog_product_requests')
export class CatalogProductRequestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_product_id' })
  catalogProductId: string;

  @Column({ name: 'product_name', type: 'varchar', length: 150 })
  productName: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 150 })
  customerName: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'varchar', length: 20, default: 'NUEVA' })
  status: CatalogProductRequestStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observation: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string | null;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
