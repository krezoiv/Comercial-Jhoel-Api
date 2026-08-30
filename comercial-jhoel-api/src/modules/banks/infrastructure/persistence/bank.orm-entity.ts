import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountTypeOrmEntity } from '../../../account-types/infrastructure/persistence/account-type.orm-entity';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/user.orm-entity';
import { DecimalColumnTransformer } from '../../../../shared/infrastructure/persistence/decimal.transformer';

// (name, account_number) is unique only among *active* banks — same
// partial unique index pattern as every other catalog table in this app.
@Entity('banks')
@Index('UQ_banks_name_account_number_active', ['name', 'accountNumber'], {
  unique: true,
  where: '"is_active" = true',
})
export class BankOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  // VARCHAR on purpose — an account number is an identifier, never an
  // operand in arithmetic. Storing it as INTEGER/BIGINT would silently
  // drop leading zeros. Never parse this column as a number anywhere.
  @Column({ name: 'account_number', type: 'varchar', length: 34 })
  accountNumber: string;

  @Column({ name: 'account_type_id' })
  accountTypeId: string;

  @ManyToOne(() => AccountTypeOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'account_type_id' })
  accountType: AccountTypeOrmEntity;

  @Column({
    name: 'previous_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  previousBalance: number;

  @Column({
    name: 'final_balance',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  finalBalance: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

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
