import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AccountType } from '../../domain/entities/account-type.entity';
import {
  AccountTypeRepository,
  CreateAccountTypeData,
  FindAccountTypesOptions,
  UpdateAccountTypeData,
} from '../../domain/repositories/account-type.repository';
import { AccountTypeNameAlreadyExistsError } from '../../domain/errors/account-type-name-already-exists.error';
import { AccountTypeOrmEntity } from './account-type.orm-entity';
import { AccountTypeMapper } from './account-type.mapper';

@Injectable()
export class TypeOrmAccountTypeRepository implements AccountTypeRepository {
  constructor(
    @InjectRepository(AccountTypeOrmEntity)
    private readonly repository: Repository<AccountTypeOrmEntity>,
  ) {}

  async findAll(options: FindAccountTypesOptions): Promise<AccountType[]> {
    const orms = await this.repository.find({
      where: options.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => AccountTypeMapper.toDomain(orm));
  }

  async findById(id: string): Promise<AccountType | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? AccountTypeMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<AccountType | null> {
    const orm = await this.repository.findOne({
      where: { name, isActive: true },
    });
    return orm ? AccountTypeMapper.toDomain(orm) : null;
  }

  async create(data: CreateAccountTypeData): Promise<AccountType> {
    const orm = this.repository.create({
      name: data.name,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return AccountTypeMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(id: string, data: UpdateAccountTypeData): Promise<AccountType> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return AccountTypeMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Safety net for the create/update race the use case's own pre-check can't close — see `TypeOrmCategoryRepository.translateUniqueViolation`'s own doc comment. */
  private translateUniqueViolation(error: unknown, name: string): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_account_types_name_active') {
        return new AccountTypeNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
