import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientOrmEntity } from '../../../clients/infrastructure/persistence/client.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('accounts_receivable')
export class AccountReceivableOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'client_id' })
  client: ClientOrmEntity;

  // Plain DATE — hydrates as a yyyy-MM-dd string with this TypeORM version
  // (confirmed via RechargeDailyBalanceOrmEntity's own `date` column), never
  // round-tripped through a JS Date to avoid any timezone-driven shift.
  @Column({ type: 'date' })
  date: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  // Polymorphic origin tag, always set together (or not at all) — see the
  // migration's own doc comment. No FK on reference_id: it can't point at a
  // single table by construction.
  @Column({ name: 'reference_type', type: 'varchar', length: 50, nullable: true })
  referenceType: string | null;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // 'CARGO' increases the client's balance, 'ABONO' decreases it — see
  // migration `CreateFinancialKardexColumns`. `amount` is always a positive
  // magnitude; the sign always comes from this column, never from `amount`.
  @Column({ name: 'movement_type', type: 'varchar', length: 20, default: 'CARGO' })
  movementType: 'CARGO' | 'ABONO';

  // Deterministic tie-break for the Kardex's running-balance window
  // function and "balance as of a period boundary" queries — auto-
  // incrementing, never set by application code.
  @Column({ type: 'bigint' })
  sequence: string;

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

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: UserOrmEntity | null;
}
