import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, SelectQueryBuilder } from 'typeorm';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import {
  BankDepositRepository,
  BankDepositReportFilters,
  BankDepositReportSummary,
  FindBankDepositOperationsOptions,
  PaginatedResult,
  RegisterBankDepositOperationData,
} from '../../domain/repositories/bank-deposit.repository';
import { InvalidTransactionBankError } from '../../domain/errors/invalid-transaction-bank.error';
import { InvalidTransactionTypeError } from '../../domain/errors/invalid-transaction-type.error';
import { InvalidChangeGivenError } from '../../domain/errors/invalid-change-given.error';
import { InvalidDepositAmountError } from '../../domain/errors/invalid-deposit-amount.error';
import { InvalidCashQuantityError } from '../../domain/errors/invalid-cash-quantity.error';
import { CashTotalMismatchError } from '../../domain/errors/cash-total-mismatch.error';
import { TransactionTotalMismatchError } from '../../domain/errors/transaction-total-mismatch.error';
import { BankDepositOperationOrmEntity } from './bank-deposit-operation.orm-entity';
import { BankDepositOperationMapper } from './bank-deposit-operation.mapper';

@Injectable()
export class TypeOrmBankDepositRepository implements BankDepositRepository {
  constructor(
    @InjectRepository(BankDepositOperationOrmEntity)
    private readonly repository: Repository<BankDepositOperationOrmEntity>,
  ) {}

  async registerOperation(
    data: RegisterBankDepositOperationData,
  ): Promise<BankDepositOperation> {
    const cashDetailsJson = JSON.stringify(
      data.cashDetails.map((detail) => ({
        denomination: detail.denomination,
        quantity: detail.quantity,
      })),
    );
    const transactionAmountsJson = JSON.stringify(data.transactionAmounts);

    let operationId: string;
    try {
      const rows = await this.repository.manager.query<
        { register_bank_deposit_operation: string }[]
      >(
        'SELECT register_bank_deposit_operation($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9)',
        [
          data.transactionBankId,
          data.totalAmount,
          data.operationDate,
          cashDetailsJson,
          transactionAmountsJson,
          data.userId,
          data.transactionTypeId,
          data.clientName,
          data.changeGiven ?? 0,
        ],
      );
      operationId = rows[0].register_bank_deposit_operation;
    } catch (error) {
      throw this.translateBankDepositError(error);
    }

    const operation = await this.findById(operationId);
    if (!operation) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la transacción recién registrada.',
      );
    }
    return operation;
  }

  async findAll(
    options: FindBankDepositOperationsOptions,
  ): Promise<PaginatedResult<BankDepositOperation>> {
    const qb = this.repository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.transactionBank', 'transactionBank')
      .leftJoinAndSelect('operation.transactionType', 'transactionType')
      .leftJoinAndSelect('operation.user', 'user');

    this.applyFilters(qb, options);

    qb.orderBy('operation.operationDate', 'DESC').addOrderBy(
      'operation.createdAt',
      'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      // No cashDetails/transactions join here on purpose — the list view is a summary; see findById for the full detail.
      items: orms.map((orm) => BankDepositOperationMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  async findById(id: string): Promise<BankDepositOperation | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { cashDetails: true, transactions: true },
    });
    return orm ? BankDepositOperationMapper.toDomain(orm) : null;
  }

  /** Excludes voided operations from every aggregate — the same way a CANCELLED day is excluded from Cuadre de Agentes' own totals. `findAll` deliberately does NOT apply this filter — voided operations must stay visible in the list (with a badge), only the totals ignore them. */
  async getReportSummary(
    filters: BankDepositReportFilters,
  ): Promise<BankDepositReportSummary> {
    const totalsQb = this.repository.createQueryBuilder('operation');
    this.applyFilters(totalsQb, filters);
    totalsQb.andWhere('operation.isVoided = false');
    totalsQb
      .select('COUNT(*)', 'operationCount')
      .addSelect(
        'COALESCE(SUM(operation.transactionCount), 0)',
        'transactionCount',
      )
      .addSelect('COALESCE(SUM(operation.totalAmount), 0)', 'totalAmount');

    const totalsRaw = await totalsQb.getRawOne<{
      operationCount: string;
      transactionCount: string;
      totalAmount: string;
    }>();

    const byBankQb = this.repository
      .createQueryBuilder('operation')
      .leftJoin('operation.transactionBank', 'transactionBank');
    this.applyFilters(byBankQb, filters);
    byBankQb.andWhere('operation.isVoided = false');
    byBankQb
      .select('operation.transactionBankId', 'transactionBankId')
      .addSelect('transactionBank.name', 'transactionBankName')
      .addSelect('COUNT(*)', 'operationCount')
      .addSelect(
        'COALESCE(SUM(operation.transactionCount), 0)',
        'transactionCount',
      )
      .addSelect('COALESCE(SUM(operation.totalAmount), 0)', 'totalAmount')
      .groupBy('operation.transactionBankId')
      .addGroupBy('transactionBank.name')
      .orderBy('SUM(operation.totalAmount)', 'DESC');

    const byBankRaw = await byBankQb.getRawMany<{
      transactionBankId: string;
      transactionBankName: string;
      operationCount: string;
      transactionCount: string;
      totalAmount: string;
    }>();

    return {
      operationCount: parseInt(totalsRaw?.operationCount ?? '0', 10),
      transactionCount: parseInt(totalsRaw?.transactionCount ?? '0', 10),
      totalAmount: parseFloat(totalsRaw?.totalAmount ?? '0'),
      byBank: byBankRaw.map((row) => ({
        transactionBankId: row.transactionBankId,
        transactionBankName: row.transactionBankName,
        operationCount: parseInt(row.operationCount, 10),
        transactionCount: parseInt(row.transactionCount, 10),
        totalAmount: parseFloat(row.totalAmount),
      })),
    };
  }

  async voidOperation(
    id: string,
    voidedBy: string,
    reason: string,
  ): Promise<BankDepositOperation> {
    await this.repository.update(
      { id },
      {
        isVoided: true,
        voidedAt: new Date(),
        voidedBy,
        voidReason: reason,
      },
    );
    const operation = await this.findById(id);
    if (!operation) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la transacción recién anulada.',
      );
    }
    return operation;
  }

  private applyFilters(
    qb: SelectQueryBuilder<BankDepositOperationOrmEntity>,
    filters: {
      transactionBankId?: string;
      transactionTypeId?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
    },
  ): void {
    if (filters.transactionBankId) {
      qb.andWhere('operation.transactionBankId = :transactionBankId', {
        transactionBankId: filters.transactionBankId,
      });
    }
    if (filters.transactionTypeId) {
      qb.andWhere('operation.transactionTypeId = :transactionTypeId', {
        transactionTypeId: filters.transactionTypeId,
      });
    }
    if (filters.userId) {
      qb.andWhere('operation.userId = :userId', { userId: filters.userId });
    }
    if (filters.startDate) {
      qb.andWhere('operation.operationDate >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      qb.andWhere('operation.operationDate <= :endDate', {
        endDate: filters.endDate,
      });
    }
  }

  /** Same `RAISE EXCEPTION '<CODE>:<id>'` → domain-error translation as `TypeOrmPurchaseRepository.translatePurchaseError` — see that method's own doc comment for why this parsing exists. */
  private translateBankDepositError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const [code] = message.split(':');

    switch (code) {
      case 'TRANSACTION_BANK_NOT_FOUND':
      case 'TRANSACTION_BANK_INACTIVE':
        return new InvalidTransactionBankError();
      case 'TRANSACTION_TYPE_NOT_FOUND':
      case 'TRANSACTION_TYPE_INACTIVE':
        return new InvalidTransactionTypeError();
      case 'INVALID_DEPOSIT_AMOUNT':
        return new InvalidDepositAmountError();
      case 'INVALID_CASH_QUANTITY':
        return new InvalidCashQuantityError();
      case 'CASH_TOTAL_MISMATCH':
        return new CashTotalMismatchError();
      case 'TRANSACTION_TOTAL_MISMATCH':
        return new TransactionTotalMismatchError();
      case 'INVALID_CHANGE_GIVEN':
        return new InvalidChangeGivenError();
      default:
        return error;
    }
  }
}
