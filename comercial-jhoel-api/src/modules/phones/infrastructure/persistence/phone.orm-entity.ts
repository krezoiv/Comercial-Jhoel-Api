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
import type {
  PhoneOperator,
  PhoneStatus,
} from '../../domain/entities/phone.entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

// UQ_phones_imei (global) and UQ_phones_phone_number_available (partial,
// WHERE status = 'DISPONIBLE') are both raw SQL in the migration — TypeORM's
// @Index decorator can express the plain one but not the partial one, so
// neither is mirrored here as a decorator, matching this codebase's own
// `clients`/`products` precedent for functional/partial indexes.
@Entity('phones')
export class PhoneOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  operator: PhoneOperator;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 20 })
  imei: string;

  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  costPrice: number;

  @Column({
    name: 'public_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  publicPrice: number;

  @Column({ type: 'varchar', length: 20, default: 'DISPONIBLE' })
  status: PhoneStatus;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: string;

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
