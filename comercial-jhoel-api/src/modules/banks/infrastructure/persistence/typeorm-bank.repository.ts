import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Bank } from '../../domain/entities/bank.entity';
import {
  BankRepository,
  CreateBankData,
  FindBanksOptions,
  UpdateBankData,
} from '../../domain/repositories/bank.repository';
import { BankAlreadyExistsError } from '../../domain/errors/bank-already-exists.error';
import { BankOrmEntity } from './bank.orm-entity';
import { BankMapper } from './bank.mapper';

@Injectable()
export class TypeOrmBankRepository implements BankRepository {
  constructor(
    @InjectRepository(BankOrmEntity)
    private readonly repository: Repository<BankOrmEntity>,
  ) {}

  async findAll(options: FindBanksOptions): Promise<Bank[]> {
    const qb = this.repository
      .createQueryBuilder('bank')
      .leftJoinAndSelect('bank.accountType', 'accountType')
      .orderBy('bank.name', 'ASC');

    if (options.activeOnly) {
      qb.andWhere('bank.isActive = true');
    }
    if (options.search) {
      qb.andWhere(
        '(bank.name ILIKE :search OR bank.accountNumber ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }

    const orms = await qb.getMany();
    return orms.map((orm) => BankMapper.toDomain(orm));
  }

  async findById(id: string): Promise<Bank | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? BankMapper.toDomain(orm) : null;
  }

  async findByActiveNameAndAccountNumber(
    name: string,
    accountNumber: string,
  ): Promise<Bank | null> {
    const orm = await this.repository.findOne({
      where: { name, accountNumber, isActive: true },
    });
    return orm ? BankMapper.toDomain(orm) : null;
  }

  async create(data: CreateBankData): Promise<Bank> {
    const orm = this.repository.create({
      name: data.name,
      accountNumber: data.accountNumber,
      accountTypeId: data.accountTypeId,
      previousBalance: data.previousBalance,
      finalBalance: data.finalBalance,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return BankMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name, data.accountNumber);
    }
  }

  async update(id: string, data: UpdateBankData): Promise<Bank> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(
        error,
        data.name ?? '',
        data.accountNumber ?? '',
      );
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return BankMapper.toDomain(updated);
  }

  async deactivate(id: string): Promise<void> {
    await this.repository.update({ id }, { isActive: false });
  }

  /** Same DB-level-uniqueness-as-race-safety-net pattern as `TypeOrmProductRepository`'s own `translateUniqueViolation` — the use case's pre-check is the primary guard, this is the backstop. */
  private translateUniqueViolation(
    error: unknown,
    name: string,
    accountNumber: string,
  ): unknown {
    if (error instanceof QueryFailedError) {
      const constraint = (
        error.driverError as { constraint?: string } | undefined
      )?.constraint;
      if (constraint === 'UQ_banks_name_account_number_active') {
        return new BankAlreadyExistsError(name, accountNumber);
      }
    }
    return error;
  }
}
