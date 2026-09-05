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
import { QuotationDetailOrmEntity } from './quotation-detail.orm-entity';

@Entity('quotations')
export class QuotationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quotation_number', type: 'varchar', length: 20 })
  quotationNumber: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => ClientOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'client_id' })
  client: ClientOrmEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;

  @Column({ name: 'quotation_date', type: 'timestamptz' })
  quotationDate: Date;

  // `date`-typed columns hydrate as a plain `yyyy-MM-dd` string in this
  // TypeORM version, not a JS Date — see `RechargeDailyBalanceOrmEntity`'s
  // own doc comment for the same confirmed behavior.
  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  subtotal: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  discount: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  total: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observations: string | null;

  @Column({ name: 'commercial_terms', type: 'varchar', length: 500, nullable: true })
  commercialTerms: string | null;

  @Column({ type: 'varchar', length: 20 })
  status: 'PENDIENTE' | 'ACEPTADA' | 'ANULADA';

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

  @Column({ name: 'converted_to_sale_id', type: 'uuid', nullable: true })
  convertedToSaleId: string | null;

  @OneToMany(() => QuotationDetailOrmEntity, (detail) => detail.quotation)
  items: QuotationDetailOrmEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
