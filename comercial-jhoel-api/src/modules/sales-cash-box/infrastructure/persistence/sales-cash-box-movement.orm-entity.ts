import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { BusinessOrmEntity } from '../../../businesses/infrastructure/persistence/business.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import type { CashBoxMovementType } from '../../domain/entities/sales-cash-box-movement.entity';

@Entity('sales_cash_box_movements')
export class SalesCashBoxMovementOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_id' })
  @Index('IDX_sales_cash_box_movements_business_id')
  businessId: string;

  @ManyToOne(() => BusinessOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'business_id' })
  business: BusinessOrmEntity;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ name: 'movement_type', type: 'varchar', length: 20 })
  movementType: CashBoxMovementType;

  @Column({ type: 'varchar', length: 255 })
  concept: string;

  @Column({ name: 'created_by' })
  createdByUserId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_voided', type: 'boolean', default: false })
  @Index('IDX_sales_cash_box_movements_is_voided')
  isVoided: boolean;

  @Column({ name: 'voided_at', type: 'timestamptz', nullable: true })
  voidedAt: Date | null;

  @Column({ name: 'voided_by', type: 'uuid', nullable: true })
  voidedByUserId: string | null;

  @ManyToOne(() => UserOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'voided_by' })
  voidedByUser: UserOrmEntity | null;

  @Column({ name: 'void_reason', type: 'varchar', length: 255, nullable: true })
  voidReason: string | null;
}
