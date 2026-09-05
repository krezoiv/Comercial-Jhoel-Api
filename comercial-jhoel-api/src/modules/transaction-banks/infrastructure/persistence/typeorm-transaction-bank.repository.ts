import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { TransactionBank } from '../../domain/entities/transaction-bank.entity';
import {
  CreateTransactionBankData,
  FindTransactionBanksOptions,
  TransactionBankRepository,
  UpdateTransactionBankData,
} from '../../domain/repositories/transaction-bank.repository';
import { TransactionBankNameAlreadyExistsError } from '../../domain/errors/transaction-bank-name-already-exists.error';
import { TransactionBankOrmEntity } from './transaction-bank.orm-entity';
import { TransactionBankMapper } from './transaction-bank.mapper';

@Injectable()
export class TypeOrmTransactionBankRepository implements TransactionBankRepository {
  constructor(
    @InjectRepository(TransactionBankOrmEntity)
    private readonly repository: Repository<TransactionBankOrmEntity>,
  ) {}

  async findAll(
    options: FindTransactionBanksOptions,
  ): Promise<TransactionBank[]> {
    const orms = await this.repository.find({
      where: options.activeOnly ? { isActive: true } : {},
      order: { name: 'ASC' },
    });
    return orms.map((orm) => TransactionBankMapper.toDomain(orm));
  }

  async findById(id: string): Promise<TransactionBank | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? TransactionBankMapper.toDomain(orm) : null;
  }

  async findByActiveName(name: string): Promise<TransactionBank | null> {
    const orm = await this.repository.findOne({
      where: { name, isActive: true },
    });
    return orm ? TransactionBankMapper.toDomain(orm) : null;
  }

  async create(data: CreateTransactionBankData): Promise<TransactionBank> {
    const orm = this.repository.create({
      name: data.name,
      createdBy: data.createdBy,
    });
    try {
      const saved = await this.repository.save(orm);
      const withRelations = await this.repository.findOneOrFail({
        where: { id: saved.id },
      });
      return TransactionBankMapper.toDomain(withRelations);
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name);
    }
  }

  async update(
    id: string,
    data: UpdateTransactionBankData,
  ): Promise<TransactionBank> {
    const { updatedBy, ...rest } = data;
    try {
      await this.repository.update({ id }, { ...rest, updatedBy });
    } catch (error) {
      throw this.translateUniqueViolation(error, data.name ?? '');
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return TransactionBankMapper.toDomain(updated);
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
      if (constraint === 'UQ_transaction_banks_name_active') {
        return new TransactionBankNameAlreadyExistsError(name);
      }
    }
    return error;
  }
}
