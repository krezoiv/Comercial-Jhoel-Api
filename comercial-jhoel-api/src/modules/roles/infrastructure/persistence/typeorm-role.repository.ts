import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Role } from '../../domain/entities/role.entity';
import {
  CreateRoleData,
  RoleRepository,
  UpdateRoleData,
} from '../../domain/repositories/role.repository';
import { RoleNameAlreadyExistsError } from '../../domain/errors/role-name-already-exists.error';
import { RoleOrmEntity } from './role.orm-entity';
import { RoleMapper } from './role.mapper';

@Injectable()
export class TypeOrmRoleRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repository: Repository<RoleOrmEntity>,
  ) {}

  async findAll(options?: { activeOnly?: boolean }): Promise<Role[]> {
    const orms = await this.repository.find({
      where: options?.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => RoleMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Role | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? RoleMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const orm = await this.repository.findOne({ where: { name } });
    return orm ? RoleMapper.toDomain(orm) : null;
  }

  async create(data: CreateRoleData): Promise<Role> {
    const orm = this.repository.create({
      name: data.name,
      description: data.description,
    });
    try {
      const saved = await this.repository.save(orm);
      return RoleMapper.toDomain(saved);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateRoleData): Promise<Role> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return RoleMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /**
   * Deliberately raw SQL against `users` instead of importing UsersModule's
   * domain — RolesModule is a dependency of UsersModule, so importing back
   * would create a circular module reference. `users`/`role_id` are stable,
   * migration-owned column names, same trust boundary as a migration itself.
   */
  async countUsersByRoleId(
    roleId: string,
    activeOnly = false,
  ): Promise<number> {
    const rows = await this.repository.manager.query<{ count: number }[]>(
      `SELECT COUNT(*)::int AS count FROM "users" WHERE "role_id" = $1${
        activeOnly ? ' AND "is_active" = true' : ''
      }`,
      [roleId],
    );
    return rows[0]?.count ?? 0;
  }

  private translateUniqueViolation(error: unknown, name: string): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_roles_name') {
        return new RoleNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
