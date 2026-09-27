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
import { SpecialAccountAlreadyAssignedError } from '../../domain/errors/bank-movement.errors';
import { BankOrmEntity } from './bank.orm-entity';
import { BankMapper } from './bank.mapper';
import { applySearchTerms } from '../../../../shared/infrastructure/persistence/apply-search-terms.util';

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
      applySearchTerms(
        qb,
        options.search,
        (param) =>
          `(search_normalize(bank.name) LIKE search_normalize(:${param}) OR search_normalize(bank.accountNumber) LIKE search_normalize(:${param}))`,
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
    try {
      // La cuenta y su movimiento SALDO_INICIAL se crean juntos: el ledger
      // arranca desde el primer momento igual a `final_balance`.
      const savedId = await this.repository.manager.transaction(
        async (manager) => {
          const saved = await manager.save(
            manager.create(BankOrmEntity, {
              name: data.name,
              accountNumber: data.accountNumber,
              accountTypeId: data.accountTypeId,
              previousBalance: data.previousBalance,
              finalBalance: data.finalBalance,
              specialAccount: data.specialAccount,
              maxBalance: data.maxBalance,
              createdBy: data.createdBy,
            }),
          );
          await manager.query(
            `INSERT INTO bank_account_movements (
               bank_id, movement_type, origin, amount, balance_before, balance_after,
               business_date, user_id, concept
             ) VALUES ($1, 'SALDO_INICIAL', 'SALDO_INICIAL', $2, 0, $2, CURRENT_DATE, $3, 'Saldo inicial de la cuenta')`,
            [saved.id, data.finalBalance, data.createdBy],
          );
          return saved.id;
        },
      );
      const withRelations = await this.repository.findOneOrFail({
        where: { id: savedId },
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
      if (constraint === 'UQ_banks_special_account_single_active') {
        return new SpecialAccountAlreadyAssignedError();
      }
    }
    return error;
  }
}
