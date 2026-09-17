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
import type {
  CatalogRequestStatus,
  CatalogRequestType,
} from '../../domain/entities/catalog-request.entity';

@Entity('catalog_requests')
export class CatalogRequestOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'catalog_phone_id', type: 'uuid', nullable: true })
  catalogPhoneId: string | null;

  @Column({ type: 'varchar', length: 80 })
  brand: string;

  @Column({ type: 'varchar', length: 150 })
  model: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @Column({ name: 'credit_available', type: 'boolean' })
  creditAvailable: boolean;

  @Column({ name: 'request_type', type: 'varchar', length: 20 })
  requestType: CatalogRequestType;

  @Column({ name: 'customer_name', type: 'varchar', length: 150 })
  customerName: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ type: 'varchar', length: 20, default: 'NUEVA' })
  status: CatalogRequestStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observation: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
