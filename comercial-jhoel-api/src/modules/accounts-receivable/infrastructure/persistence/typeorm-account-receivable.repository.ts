import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { AccountReceivable } from '../../domain/entities/account-receivable.entity';
import {
  AccountReceivableRepository,
  AccountReceivableSortField,
  AccountReceivableStatement,
  AccountsReceivableReportSummary,
  CreateAccountReceivableData,
  FindAccountsReceivableOptions,
  FindAccountsReceivableReportSummaryOptions,
  GetAccountReceivableStatementOptions,
  PaginatedResult,
  RegisterAccountReceivableMovementData,
  UpdateAccountReceivableData,
} from '../../domain/repositories/account-receivable.repository';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import { AbonoExceedsBalanceError } from '../../domain/errors/abono-exceeds-balance.error';
import {
  InvalidMovementAmountError,
  InvalidMovementTypeError,
} from '../../domain/errors/invalid-movement.error';
import { AccountReceivableOrmEntity } from './account-receivable.orm-entity';
import { settlementErrorFromMessage } from '../../domain/errors/account-receivable-settlement.errors';
import { AccountReceivableMapper } from './account-receivable.mapper';
import type { PortfolioRecordTrace } from '../../../../shared/domain/portfolio-record';
import {
  loadPortfolioStatement,
  loadPortfolioTraces,
  translatePortfolioWriteError,
  updatePortfolioRecord,
  voidPortfolioRecord,
} from '../../../../shared/infrastructure/persistence/portfolio-record.sql';

const SORT_COLUMN: Record<AccountReceivableSortField, string> = {
  date: 'record.date',
  amount: 'record.amount',
  createdAt: 'record.createdAt',
};

@Injectable()
export class TypeOrmAccountReceivableRepository implements AccountReceivableRepository {
  constructor(
    @InjectRepository(AccountReceivableOrmEntity)
    private readonly repository: Repository<AccountReceivableOrmEntity>,
  ) {}

  async findAll(
    options: FindAccountsReceivableOptions,
  ): Promise<PaginatedResult<AccountReceivable>> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.client', 'client')
      .leftJoinAndSelect('record.createdByUser', 'createdByUser')
      .leftJoinAndSelect('record.updatedByUser', 'updatedByUser');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.minAmount !== undefined) {
      qb.andWhere('record.amount >= :minAmount', {
        minAmount: options.minAmount,
      });
    }
    if (options.maxAmount !== undefined) {
      qb.andWhere('record.amount <= :maxAmount', {
        maxAmount: options.maxAmount,
      });
    }
    if (options.search) {
      qb.andWhere(
        '(search_normalize(record.description) LIKE search_normalize(:search) OR search_normalize(client.name) LIKE search_normalize(:search))',
        {
          search: `%${options.search}%`,
        },
      );
    }

    qb.orderBy(
      SORT_COLUMN[options.sortBy],
      options.sortDirection === 'asc' ? 'ASC' : 'DESC',
    );
    qb.skip((options.page - 1) * options.limit).take(options.limit);

    const [orms, total] = await qb.getManyAndCount();
    return {
      items: orms.map((orm) => AccountReceivableMapper.toDomain(orm)),
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  /** A real SQL aggregate — never an in-memory sum over one fetched page, which would silently undercount whatever didn't fit the page (see Reports' own `getSummary()` lesson for Sales/Purchases). */
  async getReportSummary(
    options: FindAccountsReceivableReportSummaryOptions,
  ): Promise<AccountsReceivableReportSummary> {
    const qb = this.repository
      .createQueryBuilder('record')
      .leftJoin('record.client', 'client');

    if (options.isActive !== undefined) {
      qb.andWhere('record.isActive = :isActive', {
        isActive: options.isActive,
      });
    }
    if (options.clientId) {
      qb.andWhere('record.clientId = :clientId', {
        clientId: options.clientId,
      });
    }
    if (options.dateFrom) {
      qb.andWhere('record.date >= :dateFrom', { dateFrom: options.dateFrom });
    }
    if (options.dateTo) {
      qb.andWhere('record.date <= :dateTo', { dateTo: options.dateTo });
    }
    if (options.search) {
      qb.andWhere(
        '(search_normalize(record.description) LIKE search_normalize(:search) OR search_normalize(client.name) LIKE search_normalize(:search))',
        {
          search: `%${options.search}%`,
        },
      );
    }

    // Signed sum, not a bare `SUM(amount)` — `amount` is always a positive
    // magnitude now (see migration `CreateFinancialKardexColumns`), the
    // sign comes from `movement_type`. This is the one caller-facing change
    // that migration required: `GetCuadreAgentesSummaryUseCase` reads
    // `.totalAmount` from here for its daily formula and must keep getting
    // the true signed balance, not an inflated always-positive sum.
    const raw = await qb
      .select('COUNT(*)', 'recordCount')
      .addSelect(
        `COALESCE(SUM(CASE WHEN record.movementType = 'ABONO' THEN -record.amount ELSE record.amount END), 0)`,
        'totalAmount',
      )
      .getRawOne<{ recordCount: string; totalAmount: string }>();

    return {
      recordCount: Number(raw?.recordCount ?? 0),
      totalAmount: Number(raw?.totalAmount ?? 0),
    };
  }

  async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<AccountReceivable | null> {
    const orm = await this.getManager(context).findOne(
      AccountReceivableOrmEntity,
      { where: { id } },
    );
    return orm ? AccountReceivableMapper.toDomain(orm) : null;
  }

  /** Resolves the connection to use for a call: the shared transactional `EntityManager` when a `TransactionContext` was passed in, or this repository's own default connection otherwise — every caller that doesn't pass one gets byte-identical behavior to before this parameter existed. */
  private getManager(context?: TransactionContext): EntityManager {
    return (context as EntityManager | undefined) ?? this.repository.manager;
  }

  async create(data: CreateAccountReceivableData): Promise<AccountReceivable> {
    const orm = this.repository.create(data);
    const saved = await this.repository.save(orm);
    const withRelations = await this.repository.findOneOrFail({
      where: { id: saved.id },
    });
    return AccountReceivableMapper.toDomain(withRelations);
  }

  /**
   * Through `update_portfolio_record`: locks (caja → client → row), then one
   * UPDATE whose triggers enforce the rules (reason for cash changes, voided
   * rows are history, linked cargos follow their operation, balance never
   * negative), reverse + re-apply the Kardex effect and append the history.
   */
  async update(
    id: string,
    data: UpdateAccountReceivableData,
  ): Promise<AccountReceivable> {
    try {
      await updatePortfolioRecord(
        this.repository.manager,
        'accounts_receivable',
        id,
        {
          clientId: data.clientId,
          date: data.date,
          amount: data.amount,
          description: data.description,
          paymentMethod: data.paymentMethod,
          reason: data.reason,
          userId: data.updatedBy,
        },
      );
    } catch (error) {
      throw this.translateWriteError(error);
    }
    const updated = await this.repository.findOneOrFail({ where: { id } });
    return AccountReceivableMapper.toDomain(updated);
  }

  /** Soft void with reason through `void_portfolio_record` (idempotent: a second void is rejected, never re-reversed). */
  async deactivate(id: string, reason: string, userId: string): Promise<void> {
    try {
      await voidPortfolioRecord(
        this.repository.manager,
        'accounts_receivable',
        id,
        reason,
        userId,
      );
    } catch (error) {
      throw this.translateWriteError(error);
    }
  }

  async getTrace(id: string): Promise<PortfolioRecordTrace | null> {
    const traces = await loadPortfolioTraces(
      this.repository.manager,
      'accounts_receivable',
      [id],
    );
    return traces.get(id) ?? null;
  }

  /**
   * `trg_ar_payment_guard` (collection rows, charges with payments) and the
   * portfolio guard/functions signal rule violations with `RAISE 'CODE:…'` —
   * turned into their domain errors here instead of a raw 500.
   */
  private translateWriteError(error: unknown): unknown {
    if (error instanceof QueryFailedError) {
      const settlement = settlementErrorFromMessage(error.message);
      if (settlement) {
        return settlement;
      }
    }
    const portfolio = translatePortfolioWriteError(error);
    return portfolio !== error ? portfolio : this.translateMovementError(error);
  }

  /** Invokes `register_account_receivable_movement` — see that function's own doc comment (migration `CreateFinancialKardexColumns`) for the `ABONO_EXCEEDS_BALANCE` rule this table enforces, unlike Activos. */
  async registerMovement(
    data: RegisterAccountReceivableMovementData,
    context?: TransactionContext,
  ): Promise<AccountReceivable> {
    const manager = this.getManager(context);
    let movementId: string;
    try {
      const rows = await manager.query<
        { register_account_receivable_movement: string }[]
      >(
        'SELECT register_account_receivable_movement($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          data.clientId,
          data.movementType,
          data.amount,
          data.date,
          data.description,
          data.createdBy,
          data.referenceType ?? null,
          data.referenceId ?? null,
          data.paymentMethod ?? null,
        ],
      );
      movementId = rows[0].register_account_receivable_movement;
    } catch (error) {
      throw this.translateWriteError(error);
    }

    const record = await this.findById(movementId, context);
    if (!record) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el movimiento recién registrado.',
      );
    }
    return record;
  }

  /** A single bounded aggregate — never a full-history fetch summed in TypeScript. */
  async getCurrentBalance(clientId: string): Promise<number> {
    const [row] = await this.repository.manager.query<{ balance: string }[]>(
      `SELECT COALESCE(SUM(CASE WHEN movement_type = 'ABONO' THEN -amount ELSE amount END), 0) AS balance
       FROM accounts_receivable
       WHERE client_id = $1 AND is_active = true`,
      [clientId],
    );
    return Number(row?.balance ?? 0);
  }

  /**
   * `openingBalance` = signed sum of the active rows before `dateFrom`;
   * `balanceAfter` = window sum over `sequence` of ACTIVE rows (never stored).
   * Voided rows stay in place with their reason and Kardex reversal (they no
   * longer count) — see `loadPortfolioStatement`.
   */
  async getStatement(
    clientId: string,
    options: GetAccountReceivableStatementOptions,
  ): Promise<AccountReceivableStatement> {
    return loadPortfolioStatement(
      this.repository.manager,
      'accounts_receivable',
      clientId,
      options,
    );
  }

  /** `register_account_receivable_movement` signals a business-rule failure via `RAISE EXCEPTION '<CODE>:<clientId>'` — same `'CODE:id'` convention as `translateSaleError`/`translatePurchaseError` elsewhere in this codebase. */
  private translateMovementError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }

    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const [code] = message.split(':');

    switch (code) {
      case 'INVALID_MOVEMENT_TYPE':
        return new InvalidMovementTypeError();
      case 'INVALID_AMOUNT':
        return new InvalidMovementAmountError();
      case 'ABONO_EXCEEDS_BALANCE':
        return new AbonoExceedsBalanceError();
      default:
        return error;
    }
  }
}
