import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from '../../../roles/infrastructure/persistence/role.orm-entity';

@Entity('users')
@Unique('UQ_users_username', ['username'])
@Unique('UQ_users_phone', ['phone'])
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', unique: true, length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @ManyToOne(() => RoleOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10, default: 'LIGHT' })
  theme: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
