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

// UQ_phones_imei (global), UQ_phones_sim_number (global), and
// UQ_phones_phone_number_active (partial, WHERE status = 'VENDIDO') are all
// raw SQL in the migrations — TypeORM's @Index decorator can express the
// plain ones but not the partial one, so none are mirrored here as
// decorators, matching this codebase's own `clients`/`products` precedent
// for functional/partial indexes.
@Entity('phones')
export class PhoneOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10 })
  operator: PhoneOperator;

  @Column({ type: 'varchar', length: 150 })
  model: string;

  /** `null` until sold — see `phone.entity.ts`'s own doc comment. */
  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 20 })
  imei: string;

  @Column({ name: 'sim_number', type: 'varchar', length: 30 })
  simNumber: string;

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
