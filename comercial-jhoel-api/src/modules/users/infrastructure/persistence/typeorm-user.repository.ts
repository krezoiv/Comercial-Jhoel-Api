import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  CreateUserData,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';
import { UserOrmEntity } from './user.orm-entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

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
    });

    try {
      const saved = await this.repository.save(orm);
      return UserMapper.toDomain(saved);
    } catch (error) {
      // Safety net against the race between the use case's pre-check and this
      // insert: the DB-level unique constraints are the real guarantee.
      if (error instanceof QueryFailedError) {
        const constraint = (
          error.driverError as { constraint?: string } | undefined
        )?.constraint;
        if (constraint === 'UQ_users_username') {
          throw new UsernameAlreadyExistsError(data.username);
        }
        if (constraint === 'UQ_users_phone') {
          throw new PhoneAlreadyExistsError(data.phone);
        }
      }
      throw error;
    }
  }
}
