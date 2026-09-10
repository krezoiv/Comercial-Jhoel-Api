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
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';
import { SaleDetailOrmEntity } from './sale-detail.orm-entity';

@Entity('sales')
export class SaleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'sale_date', type: 'timestamptz' })
  saleDate: Date;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  total: number;

  // 'OPEN' = a receipt still being built (stock already reserved on each line);
  // 'CONFIRMED' = a real, completed sale. Never 'CANCELLED' — an abandoned
  // OPEN sale is hard-deleted by cancel_open_sale(), not soft-cancelled.
  @Column({ type: 'varchar', length: 20, default: 'CONFIRMED' })
  status: 'OPEN' | 'CONFIRMED';

  @Column({ name: 'client_id', nullable: true })
  clientId: string | null;

  @ManyToOne(() => ClientOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientOrmEntity | null;

  // 'PUBLIC' (default) or 'WHOLESALE' — chosen once at the start of the sale
  // (see configure_open_sale) and locked once the receipt has any line item,
  // so it never disagrees with prices already fixed on existing sale_details rows.
  @Column({
    name: 'price_list',
    type: 'varchar',
    length: 20,
    default: 'PUBLIC',
  })
  priceList: 'PUBLIC' | 'WHOLESALE';

  // Opaque, client-generated id scoping "which open receipt" for a user with
  // several open at once (see migration `AddDraftKeyToSales`) — NULL for a
  // CONFIRMED sale, only meaningful while status = 'OPEN'.
  @Column({ name: 'draft_key', type: 'varchar', length: 64, nullable: true })
  draftKey: string | null;

  @OneToMany(() => SaleDetailOrmEntity, (detail) => detail.sale)
  items: SaleDetailOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'invoice_number', type: 'varchar', length: 50, nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'is_voided', type: 'boolean', default: false })
  isVoided: boolean;

  @Column({ name: 'voided_at', type: 'timestamptz', nullable: true })
  voidedAt: Date | null;

  @Column({ name: 'voided_by', type: 'uuid', nullable: true })
  voidedBy: string | null;

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
