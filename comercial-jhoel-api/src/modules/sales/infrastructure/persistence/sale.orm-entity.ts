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

  @OneToMany(() => SaleDetailOrmEntity, (detail) => detail.sale)
  items: SaleDetailOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
