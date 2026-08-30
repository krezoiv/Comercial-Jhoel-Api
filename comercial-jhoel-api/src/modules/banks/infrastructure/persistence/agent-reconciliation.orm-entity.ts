import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

@Entity('agent_reconciliations')
export class AgentReconciliationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({
    name: 'total_cash',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalCash: number;

  @Column({
    name: 'total_banks',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalBanks: number;

  @Column({
    name: 'total_assets',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalAssets: number;

  @Column({
    name: 'total_accounts_receivable',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  totalAccountsReceivable: number;

  // Deliberately no CHECK constraint (unlike assets/accounts_receivable's
  // amount columns) — the formula this stores (efectivo + bancos + cxc -
  // activos) can genuinely land negative, and that is exactly the "ROJO"
  // state the frontend is meant to surface, not an invalid row.
  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  result: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser: UserOrmEntity;
}
