import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  QueryFailedError,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import {
  BankDepositDailyTransactionCount,
  BankDepositMonthlyTransactionCount,
  BankDepositRepository,
  BankDepositReportFilters,
  BankDepositReportSummary,
  FindBankDepositOperationsOptions,
  PaginatedResult,
  RegisterBankDepositOperationData,
} from '../../domain/repositories/bank-deposit.repository';
import type { TransactionContext } from '../../../../shared/application/ports/transaction-manager.port';
import { InvalidTransactionBankError } from '../../domain/errors/invalid-transaction-bank.error';
import { InvalidTransactionTypeError } from '../../domain/errors/invalid-transaction-type.error';
import { InvalidChangeGivenError } from '../../domain/errors/invalid-change-given.error';
import { InvalidDepositAmountError } from '../../domain/errors/invalid-deposit-amount.error';
import { InvalidCashQuantityError } from '../../domain/errors/invalid-cash-quantity.error';
import { CashTotalMismatchError } from '../../domain/errors/cash-total-mismatch.error';
import { TransactionTotalMismatchError } from '../../domain/errors/transaction-total-mismatch.error';
import {
  CashBreakdownNotExpectedError,
  CashBreakdownRequiredError,
} from '../../domain/errors/cash-breakdown.error';
import { InvalidBankDepositClientError } from '../../domain/errors/invalid-bank-deposit-client.error';
import { BankDepositOperationNotFoundError } from '../../domain/errors/bank-deposit-operation-not-found.error';
import { BankDepositOperationAlreadyVoidedError } from '../../domain/errors/bank-deposit-operation-already-voided.error';
import { InvalidBankAccountError } from '../../domain/errors/invalid-bank-account.error';
import { InvalidBankDepositDescriptionError } from '../../domain/errors/invalid-bank-deposit-description.error';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';
import { portfolioRecordErrorFromMessage } from '../../../../shared/domain/portfolio-record';
import { paymentGroupErrorFromMessage } from '../../../payment-groups/domain/payment-group';
import { BankDepositOperationOrmEntity } from './bank-deposit-operation.orm-entity';
import { BankDepositOperationMapper } from './bank-deposit-operation.mapper';
import type {
  OperationModality,
  OperationPaymentGroupLink,
  TypeOperationEntry,
  TypeOperationFilters,
  TypeOperationSummary,
} from '../../domain/operation-modality';

/** DATE columns come back as JS dates at local midnight: back to yyyy-MM-dd. */
function toIsoDate(value: Date): string {
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${day}`;
}

/**
 * "Operaciones de <tipo>": the individual operations of a type (those that are
 * not a group delivery) and its payment groups, as one filterable list. $1 type,
 * $2 modality, $3/$4 dates, $5 status, $6 user, $7 search (description,
 * beneficiary or group code).
 */
const TYPE_ENTRIES = `
  WITH all_entries AS (
    SELECT 'INDIVIDUAL'::text AS modality, o.id, o.created_at, o.operation_date,
           COALESCE(NULLIF(btrim(o.description), ''), NULLIF(btrim(o.client_name), '')) AS description,
           o.total_amount AS amount, o.transaction_count, COALESCE(tb.name, bk.name) AS bank_name,
           o.user_id, u.username, CASE WHEN o.is_voided THEN 'ANULADA' ELSE 'VIGENTE' END AS status,
           NULL::text AS code, NULL::text AS cash_direction,
           NULL::numeric AS paid, NULL::numeric AS outstanding, NULL::numeric AS reserved
    FROM bank_deposit_operations o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN transaction_banks tb ON tb.id = o.transaction_bank_id
    LEFT JOIN banks bk ON bk.id = o.bank_account_id
    WHERE o.transaction_type_id = $1::uuid
      AND NOT EXISTS (SELECT 1 FROM payment_group_deliveries d WHERE d.operation_id = o.id)
    UNION ALL
    SELECT 'GRUPAL', b.id, b.created_at, b.operation_date, b.description, b.authorized_amount, b.item_count,
           COALESCE(tb.name, bk.name), b.created_by, u.username, b.display_status,
           b.code, b.cash_direction, b.paid_amount, b.outstanding_amount,
           CASE WHEN b.cash_direction = 'OUT' THEN b.remaining_amount ELSE 0 END
    FROM payment_group_balances b
    JOIN users u ON u.id = b.created_by
    LEFT JOIN transaction_banks tb ON tb.id = b.transaction_bank_id
    LEFT JOIN banks bk ON bk.id = b.bank_account_id
    WHERE b.transaction_type_id = $1::uuid
  ),
  entries AS (
    SELECT * FROM all_entries e
    WHERE ($2::text IS NULL OR e.modality = $2::text)
      AND ($3::date IS NULL OR e.operation_date >= $3::date)
      AND ($4::date IS NULL OR e.operation_date <= $4::date)
      AND ($5::text IS NULL OR e.status = $5::text OR ($5::text = 'ANULADA' AND e.status = 'ANULADO'))
      AND ($6::uuid IS NULL OR e.user_id = $6::uuid)
      AND ($7::text IS NULL OR search_normalize(COALESCE(e.description, '')) LIKE '%' || search_normalize($7::text) || '%'
           OR e.code ILIKE '%' || $7::text || '%')
  )
`;

@Injectable()
export class TypeOrmBankDepositRepository implements BankDepositRepository {
  constructor(
    @InjectRepository(BankDepositOperationOrmEntity)
    private readonly repository: Repository<BankDepositOperationOrmEntity>,
  ) {}

  async registerOperation(
    data: RegisterBankDepositOperationData,
    context?: TransactionContext,
  ): Promise<BankDepositOperation> {
    const manager = this.getManager(context);
    const cashDetailsJson = JSON.stringify(
      data.cashDetails.map((detail) => ({
        denomination: detail.denomination,
        quantity: detail.quantity,
      })),
    );
    const transactionAmountsJson = JSON.stringify(data.transactionAmounts);

    let operationId: string;
    try {
      const rows = await manager.query<
        { register_bank_deposit_operation: string }[]
      >(
        'SELECT register_bank_deposit_operation($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8, $9, $10, $11, $12, $13)',
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
          data.clientId ?? null,
          data.bankAccountId ?? null,
          data.cashBreakdownEnabled ?? true,
          data.description ?? null,
        ],
      );
      operationId = rows[0].register_bank_deposit_operation;
    } catch (error) {
      throw this.translateBankDepositError(error);
    }

    const operation = await this.findById(operationId, context);
    if (!operation) {
      // The function just committed it — this would only happen on a bug.
      throw new InternalServerErrorException(
        'No se pudo recuperar la transacción recién registrada.',
      );
    }
    return operation;
  }

  /** Resolves the connection to use for a call: the shared transactional `EntityManager` when a `TransactionContext` was passed in, or this repository's own default connection otherwise — every caller that doesn't pass one gets byte-identical behavior to before this parameter existed. */
  private getManager(context?: TransactionContext): EntityManager {
    return (context as EntityManager | undefined) ?? this.repository.manager;
  }

  async findAll(
    options: FindBankDepositOperationsOptions,
  ): Promise<PaginatedResult<BankDepositOperation>> {
    const qb = this.repository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.transactionBank', 'transactionBank')
      .leftJoinAndSelect('operation.transactionType', 'transactionType')
      .leftJoinAndSelect('operation.bankAccount', 'bankAccount')
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

  /** Las `limit` operaciones registradas más recientes (anuladas incluidas, igual que `findAll`) — `ORDER BY created_at DESC, id DESC` + `LIMIT` en SQL, nunca el historial completo. Sin joins a desglose/transacciones: es un resumen. */
  async findRecent(limit: number): Promise<BankDepositOperation[]> {
    const orms = await this.repository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.transactionBank', 'transactionBank')
      .leftJoinAndSelect('operation.transactionType', 'transactionType')
      .leftJoinAndSelect('operation.bankAccount', 'bankAccount')
      .leftJoinAndSelect('operation.user', 'user')
      .leftJoinAndSelect('operation.voidedByUser', 'voidedByUser')
      .orderBy('operation.createdAt', 'DESC')
      .addOrderBy('operation.id', 'DESC')
      .limit(limit)
      .getMany();
    return orms.map((orm) => BankDepositOperationMapper.toDomain(orm));
  }

  async findPaymentGroupLinks(
    operationIds: string[],
  ): Promise<Map<string, OperationPaymentGroupLink>> {
    const links = new Map<string, OperationPaymentGroupLink>();
    if (operationIds.length === 0) {
      return links;
    }
    const rows = await this.repository.manager.query<Record<string, unknown>[]>(
      `SELECT d.operation_id, g.id AS group_id, g.code, g.description, g.display_status, g.item_count,
              i.id AS item_id, i.item_number, i.status AS item_status, i.expected_amount, i.paid_amount
       FROM payment_group_deliveries d
       JOIN payment_group_balances g ON g.id = d.group_id
       JOIN payment_group_item_balances i ON i.id = d.item_id
       WHERE d.operation_id = ANY ($1::uuid[])`,
      [operationIds],
    );
    for (const row of rows) {
      links.set(String(row.operation_id), {
        groupId: String(row.group_id),
        code: String(row.code),
        description: String(row.description),
        groupStatus: String(row.display_status),
        itemId: String(row.item_id),
        itemNumber: Number(row.item_number),
        itemCount: Number(row.item_count),
        itemStatus: String(row.item_status),
        expectedAmount: Number(row.expected_amount),
        paidAmount: Number(row.paid_amount),
      });
    }
    return links;
  }

  async findTypeEntries(filters: TypeOperationFilters): Promise<{
    items: TypeOperationEntry[];
    total: number;
    summary: TypeOperationSummary;
  }> {
    const params = [
      filters.transactionTypeId,
      filters.modality ?? null,
      filters.startDate ?? null,
      filters.endDate ?? null,
      filters.status ?? null,
      filters.userId ?? null,
      filters.search?.trim()
        ? filters.search.trim().replace(/[%_\\]/g, (c) => `\\${c}`)
        : null,
    ];
    const rows = await this.repository.manager.query<Record<string, unknown>[]>(
      `${TYPE_ENTRIES} SELECT e.*, count(*) OVER () AS total_count FROM entries e
       ORDER BY e.created_at DESC, e.id DESC LIMIT $8 OFFSET $9`,
      [...params, filters.limit, (filters.page - 1) * filters.limit],
    );
    const [totals] = await this.repository.manager.query<Record<string, unknown>[]>(
      `${TYPE_ENTRIES}
       SELECT count(*) FILTER (WHERE modality = 'INDIVIDUAL') AS individual_count,
              count(*) FILTER (WHERE modality = 'GRUPAL') AS group_count,
              COALESCE(SUM(reserved), 0) AS group_reserved,
              COALESCE(SUM(paid), 0) AS group_paid,
              COALESCE(SUM(outstanding), 0) AS group_outstanding
       FROM entries`,
      params,
    );
    const num = (value: unknown) => Number(value ?? 0);
    const items: TypeOperationEntry[] = rows.map((row) => ({
      modality: row.modality as OperationModality,
      id: String(row.id),
      createdAt: row.created_at as Date,
      operationDate:
        row.operation_date instanceof Date
          ? toIsoDate(row.operation_date)
          : String(row.operation_date).slice(0, 10),
      description: row.description === null ? null : String(row.description),
      amount: num(row.amount),
      transactionCount: num(row.transaction_count),
      bankName: row.bank_name === null ? null : String(row.bank_name),
      userId: String(row.user_id),
      username: String(row.username),
      status: String(row.status),
      group:
        row.modality === 'GRUPAL'
          ? {
              code: String(row.code),
              cashDirection: row.cash_direction as 'IN' | 'OUT' | 'NONE',
              itemCount: num(row.transaction_count),
              authorizedAmount: num(row.amount),
              paidAmount: num(row.paid),
              outstandingAmount: num(row.outstanding),
              reservedAmount: num(row.reserved),
            }
          : null,
    }));
    return {
      items,
      total: rows.length ? num(rows[0].total_count) : 0,
      summary: {
        individualCount: num(totals?.individual_count),
        groupCount: num(totals?.group_count),
        groupReserved: num(totals?.group_reserved),
        groupPaid: num(totals?.group_paid),
        groupOutstanding: num(totals?.group_outstanding),
      },
    };
  }

  async findById(
    id: string,
    context?: TransactionContext,
  ): Promise<BankDepositOperation | null> {
    const orm = await this.getManager(context).findOne(
      BankDepositOperationOrmEntity,
      {
        where: { id },
        relations: { cashDetails: true, transactions: true, bankAccount: true },
      },
    );
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

    // Desembolsos/Pagos Génesis no tienen banco agente: se agrupan bajo la
    // cuenta afectada (Fundación Génesis Empresarial) en vez de quedar sin nombre.
    const byBankQb = this.repository
      .createQueryBuilder('operation')
      .leftJoin('operation.transactionBank', 'transactionBank')
      .leftJoin('operation.bankAccount', 'bankAccount');
    this.applyFilters(byBankQb, filters);
    byBankQb.andWhere('operation.isVoided = false');
    byBankQb
      .select(
        'COALESCE(operation.transactionBankId, operation.bankAccountId)',
        'transactionBankId',
      )
      .addSelect(
        'COALESCE(transactionBank.name, bankAccount.name)',
        'transactionBankName',
      )
      .addSelect('COUNT(*)', 'operationCount')
      .addSelect(
        'COALESCE(SUM(operation.transactionCount), 0)',
        'transactionCount',
      )
      .addSelect('COALESCE(SUM(operation.totalAmount), 0)', 'totalAmount')
      .groupBy('COALESCE(operation.transactionBankId, operation.bankAccountId)')
      .addGroupBy('COALESCE(transactionBank.name, bankAccount.name)')
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

  /** One row per date with at least one non-voided operation in range — `to_char` avoids the raw-`getRawMany` date/timestamp OID ambiguity `GetDashboardSummaryUseCase` already hit for this exact reason (see that use case's own doc comment); `operation_date` is a plain `DATE` column here too. */
  async getDailyTransactionCounts(
    startDate: string,
    endDate: string,
  ): Promise<BankDepositDailyTransactionCount[]> {
    const qb = this.repository.createQueryBuilder('operation');
    this.applyFilters(qb, { startDate, endDate });
    qb.andWhere('operation.isVoided = false');
    qb.select(
      "to_char(operation.operationDate, 'YYYY-MM-DD')",
      'date',
    ).addSelect(
      'COALESCE(SUM(operation.transactionCount), 0)',
      'transactionCount',
    );
    qb.groupBy('operation.operationDate').orderBy(
      'operation.operationDate',
      'ASC',
    );

    const rows = await qb.getRawMany<{
      date: string;
      transactionCount: string;
    }>();
    return rows.map((row) => ({
      date: row.date,
      transactionCount: parseInt(row.transactionCount, 10),
    }));
  }

  async getMonthlyTransactionCounts(
    startDate: string,
    endDate: string,
  ): Promise<BankDepositMonthlyTransactionCount[]> {
    const qb = this.repository.createQueryBuilder('operation');
    this.applyFilters(qb, { startDate, endDate });
    qb.andWhere('operation.isVoided = false');
    qb.select("to_char(operation.operationDate, 'YYYY-MM')", 'month').addSelect(
      'COALESCE(SUM(operation.transactionCount), 0)',
      'transactionCount',
    );
    qb.groupBy("to_char(operation.operationDate, 'YYYY-MM')").orderBy(
      'month',
      'ASC',
    );

    const rows = await qb.getRawMany<{
      month: string;
      transactionCount: string;
    }>();
    return rows.map((row) => ({
      month: row.month,
      transactionCount: parseInt(row.transactionCount, 10),
    }));
  }

  /** `void_bank_deposit_operation` marca la anulación Y registra el movimiento inverso de saldo en la misma transacción — nunca queda una operación anulada con su saldo aún aplicado (ni al revés). */
  async voidOperation(
    id: string,
    voidedBy: string,
    reason: string,
    businessDate: string,
  ): Promise<BankDepositOperation> {
    try {
      await this.repository.manager.query(
        'SELECT void_bank_deposit_operation($1, $2, $3, $4)',
        [id, businessDate, voidedBy, reason],
      );
    } catch (error) {
      throw this.translateBankDepositError(error);
    }
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
      modality?: OperationModality;
      transactionBankId?: string;
      transactionTypeId?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    },
  ): void {
    // Pagos grupales: an operation is GRUPAL when it is a group delivery / collection (derived, never stored).
    if (filters.modality === 'GRUPAL') {
      qb.andWhere(
        `${qb.alias}.id IN (SELECT pgd.operation_id FROM payment_group_deliveries pgd)`,
      );
    } else if (filters.modality === 'INDIVIDUAL') {
      qb.andWhere(
        `${qb.alias}.id NOT IN (SELECT pgd.operation_id FROM payment_group_deliveries pgd)`,
      );
    }
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
    const search = filters.search?.trim();
    if (search) {
      // Combined (AND) with every other filter. Subqueries instead of joins so
      // the aggregate queries (summary/by bank) keep their own join shape.
      qb.andWhere(
        `(
          search_normalize(${qb.alias}.description) LIKE '%' || search_normalize(:search) || '%'
          OR search_normalize(${qb.alias}.client_name) LIKE '%' || search_normalize(:search) || '%'
          OR EXISTS (SELECT 1 FROM transaction_types st WHERE st.id = ${qb.alias}.transaction_type_id
                     AND search_normalize(st.name) LIKE '%' || search_normalize(:search) || '%')
          OR EXISTS (SELECT 1 FROM transaction_banks sb WHERE sb.id = ${qb.alias}.transaction_bank_id
                     AND search_normalize(sb.name) LIKE '%' || search_normalize(:search) || '%')
          OR EXISTS (SELECT 1 FROM banks sa WHERE sa.id = ${qb.alias}.bank_account_id
                     AND search_normalize(sa.name) LIKE '%' || search_normalize(:search) || '%')
        )`,
        { search: search.replace(/[%_\\]/g, (c) => `\\${c}`) },
      );
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

    const balanceError = bankMovementErrorFromMessage(message);
    if (balanceError) {
      return balanceError;
    }

    // Voiding also voids the cargo it sent to CxC/Activos (trg_portfolio_bank_deposit_void): its rule violations.
    const portfolioError = portfolioRecordErrorFromMessage(message);
    if (portfolioError) {
      return portfolioError;
    }

    // An operation that is a Pago grupal delivery is voided from its group (trg_payment_group_operation_guard).
    if (message.startsWith('PAYMENT_GROUP_OPERATION_LOCKED')) {
      return paymentGroupErrorFromMessage(message) ?? error;
    }

    const [code, detail] = message.split(':');

    switch (code) {
      case 'BANK_DEPOSIT_DESCRIPTION_TOO_LONG':
        return new InvalidBankDepositDescriptionError();
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
      case 'CASH_BREAKDOWN_REQUIRED':
        return new CashBreakdownRequiredError();
      case 'CASH_BREAKDOWN_NOT_EXPECTED':
        return new CashBreakdownNotExpectedError();
      case 'TRANSACTION_TOTAL_MISMATCH':
        return new TransactionTotalMismatchError();
      case 'INVALID_CHANGE_GIVEN':
        return new InvalidChangeGivenError();
      case 'BANK_DEPOSIT_CLIENT_INVALID':
        return new InvalidBankDepositClientError();
      case 'BANK_NOT_FOUND':
      case 'BANK_INACTIVE':
        return new InvalidBankAccountError();
      case 'BANK_DEPOSIT_OPERATION_NOT_FOUND':
        return new BankDepositOperationNotFoundError(detail);
      case 'BANK_DEPOSIT_OPERATION_ALREADY_VOIDED':
        return new BankDepositOperationAlreadyVoidedError(detail);
      default:
        return error;
    }
  }
}
