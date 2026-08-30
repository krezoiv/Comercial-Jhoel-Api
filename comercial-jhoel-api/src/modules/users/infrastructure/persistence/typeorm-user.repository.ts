import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  CreateUserData,
  FindUsersOptions,
  PaginatedResult,
  UpdateUserData,
  UserRepository,
  UserSortField,
} from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

const SORT_COLUMN: Record<UserSortField, string> = {
  username: 'user.username',
  phone: 'user.phone',
  createdAt: 'user.createdAt',
};

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findAll(options: FindUsersOptions): Promise<PaginatedResult<User>> {
    const qb = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (options.activeOnly) {
      qb.andWhere('user.isActive = true');
    }
    if (options.search) {
      qb.andWhere('(user.username ILIKE :search OR user.phone ILIKE :search)', {
        search: `%${options.search}%`,
      });
    }
    if (options.roleId) {
      qb.andWhere('user.roleId = :roleId', { roleId: options.roleId });
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      items: orms.map((orm) => UserMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { username } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { phone } });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findByUsernameOrPhone(identifier: string): Promise<User | null> {
    const orm = await this.repository.findOne({
      where: [{ username: identifier }, { phone: identifier }],
    });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async updatePasswordHash(id: string, passwordHash: string): Promise<void> {
    await this.repository.update({ id }, { passwordHash });
  }

  async create(data: CreateUserData): Promise<User> {
    const orm = this.repository.create({
      username: data.username,
      phone: data.phone,
      passwordHash: data.passwordHash,
      roleId: data.roleId,
    });

    try {
      const saved = await this.repository.save(orm);
      // save() doesn't populate eager relations on the returned instance —
      // re-fetch so the mapper always sees `role`.
      const withRole = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return UserMapper.toDomain(withRole);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.username, data.phone);
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      await this.repository.update({ id }, data);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.username, data.phone);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return UserMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  private translateUniqueViolation(
    error: unknown,
    username?: string,
    phone?: string,
  ): unknown {
    // Safety net against the race between the use case's pre-check and this
    // write: the DB-level unique constraints are the real guarantee.
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_users_username' && username) {
        return new UsernameAlreadyExistsError(username);
      }
      if (constraint === 'UQ_users_phone' && phone) {
        return new PhoneAlreadyExistsError(phone);
      }
    }
    return error;
  }
}
