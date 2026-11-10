import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  AccountReceivableSettlementRepository,
  ChargeBalance,
  ChargePaymentRow,
  ChargePaymentStatus,
  FindSettlementsOptions,
  PaginatedSettlements,
  SettleAccountsReceivableData,
  SettlementBankInfo,
  SettlementDetailRow,
  SettlementPaymentMethod,
  SettlementRow,
  SettlementStatus,
  SettlementWithDetails,
} from '../../domain/repositories/account-receivable-settlement.repository';
import { settlementErrorFromMessage } from '../../domain/errors/account-receivable-settlement.errors';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';

type SqlRow = Record<string, unknown>;

function str(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return JSON.stringify(value);
}

function strOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : str(value);
}

function num(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function numOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

/** Pending 0 = cancelled; below the original amount = partially paid. */
export function chargeStatus(
  original: number,
  pending: number,
): ChargePaymentStatus {
  if (pending <= 0) {
    return 'CANCELADA';
  }
  return pending < original ? 'PARCIAL' : 'PENDIENTE';
}

const CHARGE_SELECT = `
  SELECT b.charge_id, b.client_id, c.name AS client_name, to_char(ar.date, 'YYYY-MM-DD') AS date,
         ar.description, ar.created_at, b.original_amount,
         b.allocated_paid + b.general_applied AS paid_amount, b.pending
  FROM ar_charge_balances($1::uuid[]) b
  JOIN accounts_receivable ar ON ar.id = b.charge_id
  JOIN clients c ON c.id = b.client_id
`;

const SETTLEMENT_SELECT = `
  SELECT o.*, c.name AS client_name, b.name AS bank_name, b.account_number AS bank_account_number,
         u.username AS created_by_username, vu.username AS voided_by_username,
         cm.new_balance AS cash_balance_after, bm.balance_after AS bank_balance_after,
         to_char(d.operational_date, 'YYYY-MM-DD') AS operational_date, p.period_number
  FROM account_receivable_payment_operations o
  JOIN clients c ON c.id = o.client_id
  JOIN users u ON u.id = o.created_by
  LEFT JOIN users vu ON vu.id = o.voided_by
  LEFT JOIN banks b ON b.id = o.bank_id
  LEFT JOIN cash_movements cm ON cm.id = o.cash_movement_id
  LEFT JOIN bank_account_movements bm ON bm.id = o.bank_movement_id
  LEFT JOIN cash_operational_days d ON d.id = o.operational_day_id
  LEFT JOIN cash_cut_periods p ON p.id = o.cut_period_id
`;

function toCharge(row: SqlRow): ChargeBalance {
  const original = num(row.original_amount);
  const pending = num(row.pending);
  return {
    id: str(row.charge_id),
    clientId: str(row.client_id),
    clientName: str(row.client_name),
    date: str(row.date),
    description: strOrNull(row.description),
    originalAmount: original,
    paidAmount: num(row.paid_amount),
    pendingAmount: pending,
    status: chargeStatus(original, pending),
    createdAt: row.created_at as Date,
  };
}

function toSettlement(row: SqlRow): SettlementRow {
  return {
    id: str(row.id),
    clientId: str(row.client_id),
    clientName: str(row.client_name),
    paymentMethod: str(row.payment_method) as SettlementPaymentMethod,
    bankId: strOrNull(row.bank_id),
    bankName: strOrNull(row.bank_name),
    bankAccountNumber: strOrNull(row.bank_account_number),
    referenceNumber: strOrNull(row.reference_number),
    totalAmount: num(row.total_amount),
    accountsCount: num(row.accounts_count),
    status: str(row.status) as SettlementStatus,
    observations: strOrNull(row.observations),
    abonoId: strOrNull(row.abono_id),
    cashMovementId: strOrNull(row.cash_movement_id),
    cashBalanceAfter: numOrNull(row.cash_balance_after),
    bankMovementId: strOrNull(row.bank_movement_id),
    bankBalanceAfter: numOrNull(row.bank_balance_after),
    operationalDate: strOrNull(row.operational_date),
    cutPeriodNumber: numOrNull(row.period_number),
    createdBy: str(row.created_by),
    createdByUsername: str(row.created_by_username),
    createdAt: row.created_at as Date,
    voidedAt: (row.voided_at as Date | null) ?? null,
    voidedByUsername: strOrNull(row.voided_by_username),
    voidReason: strOrNull(row.void_reason),
  };
}

/**
 * Raw-SQL adapter of the settlement port. Every write is a single call to a
 * PostgreSQL function (one transaction, all-or-nothing); their
 * `RAISE EXCEPTION '<CODE>'` messages become domain errors here — settlement
 * rules first, then the bank account's own rules (`apply_bank_account_movement`).
 */
@Injectable()
export class TypeOrmAccountReceivableSettlementRepository implements AccountReceivableSettlementRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private async write<T>(sql: string, params: unknown[]): Promise<T> {
    try {
      return await this.dataSource.query<T>(sql, params);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const mapped =
          settlementErrorFromMessage(error.message) ??
          bankMovementErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
      }
      throw error;
    }
  }

  async findChargeBalances(clientIds: string[]): Promise<ChargeBalance[]> {
    if (clientIds.length === 0) {
      return [];
    }
    const rows = await this.dataSource.query<SqlRow[]>(
      `${CHARGE_SELECT} ORDER BY ar.sequence`,
      [clientIds],
    );
    return rows.map(toCharge);
  }

  async findChargeBalancesByIds(ids: string[]): Promise<ChargeBalance[]> {
    if (ids.length === 0) {
      return [];
    }
    const clients = await this.dataSource.query<SqlRow[]>(
      `SELECT DISTINCT client_id FROM accounts_receivable WHERE id = ANY ($1::uuid[])`,
      [ids],
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${CHARGE_SELECT} WHERE b.charge_id = ANY ($2::uuid[]) ORDER BY ar.sequence`,
      [clients.map((row) => str(row.client_id)), ids],
    );
    return rows.map(toCharge);
  }

  async settle(data: SettleAccountsReceivableData): Promise<string> {
    const items = data.items.map((item) => ({
      id: item.accountReceivableId,
      amount: item.amount ?? null,
    }));
    const rows = await this.write<SqlRow[]>(
      `SELECT settle_accounts_receivable($1, $2::jsonb, $3, $4, $5, $6, $7, $8, $9) AS id`,
      [
        data.clientId,
        JSON.stringify(items),
        data.paymentMethod,
        data.bankId,
        data.referenceNumber,
        data.observations,
        data.expectedTotal,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return str(rows[0].id);
  }

  async void(
    operationId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    await this.write(`SELECT void_account_receivable_payment($1, $2, $3)`, [
      operationId,
      userId,
      reason,
    ]);
  }

  async findById(id: string): Promise<SettlementWithDetails | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${SETTLEMENT_SELECT} WHERE o.id = $1`,
      [id],
    );
    if (!row) {
      return null;
    }
    const details = await this.dataSource.query<SqlRow[]>(
      `SELECT d.*, to_char(ar.date, 'YYYY-MM-DD') AS account_date, ar.description AS account_description,
              ar.amount AS account_amount
       FROM account_receivable_payment_details d
       JOIN accounts_receivable ar ON ar.id = d.account_receivable_id
       WHERE d.payment_operation_id = $1
       ORDER BY ar.sequence`,
      [id],
    );
    return {
      ...toSettlement(row),
      details: details.map((detail): SettlementDetailRow => ({
        id: str(detail.id),
        accountReceivableId: str(detail.account_receivable_id),
        accountDate: str(detail.account_date),
        accountDescription: strOrNull(detail.account_description),
        accountOriginalAmount: num(detail.account_amount),
        amountPaid: num(detail.amount_paid),
        previousBalance: num(detail.previous_balance),
        newBalance: num(detail.new_balance),
      })),
    };
  }

  async findAll(
    options: FindSettlementsOptions,
  ): Promise<PaginatedSettlements> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (sql: string, value: unknown) => {
      params.push(value);
      where.push(sql.replace('?', `$${params.length}`));
    };
    if (options.clientId) add('o.client_id = ?', options.clientId);
    if (options.status) add('o.status = ?', options.status);
    if (options.paymentMethod)
      add('o.payment_method = ?', options.paymentMethod);
    if (options.dateFrom)
      add(
        `(o.created_at AT TIME ZONE 'America/Guatemala')::date >= ?::date`,
        options.dateFrom,
      );
    if (options.dateTo)
      add(
        `(o.created_at AT TIME ZONE 'America/Guatemala')::date <= ?::date`,
        options.dateTo,
      );
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM account_receivable_payment_operations o ${clause}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${SETTLEMENT_SELECT} ${clause} ORDER BY o.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map(toSettlement),
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  async findChargePayments(chargeId: string): Promise<ChargePaymentRow[]> {
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT d.payment_operation_id, d.amount_paid, d.previous_balance, d.new_balance,
              o.payment_method, o.reference_number, o.status, o.accounts_count, o.observations,
              o.created_at, b.name AS bank_name, u.username
       FROM account_receivable_payment_details d
       JOIN account_receivable_payment_operations o ON o.id = d.payment_operation_id
       JOIN users u ON u.id = o.created_by
       LEFT JOIN banks b ON b.id = o.bank_id
       WHERE d.account_receivable_id = $1
       ORDER BY o.created_at DESC`,
      [chargeId],
    );
    return rows.map((row) => ({
      operationId: str(row.payment_operation_id),
      amountPaid: num(row.amount_paid),
      previousBalance: num(row.previous_balance),
      newBalance: num(row.new_balance),
      paymentMethod: str(row.payment_method) as SettlementPaymentMethod,
      bankName: strOrNull(row.bank_name),
      referenceNumber: strOrNull(row.reference_number),
      status: str(row.status) as SettlementStatus,
      accountsCount: num(row.accounts_count),
      createdByUsername: str(row.username),
      createdAt: row.created_at as Date,
      observations: strOrNull(row.observations),
    }));
  }

  async getCashBalance(): Promise<number> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT cash_balance() AS balance`,
    );
    return num(row?.balance);
  }

  async findBank(id: string): Promise<SettlementBankInfo | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT id, name, account_number, is_active, special_account, final_balance FROM banks WHERE id = $1`,
      [id],
    );
    if (!row) {
      return null;
    }
    return {
      id: str(row.id),
      name: str(row.name),
      accountNumber: strOrNull(row.account_number),
      isActive: row.is_active === true,
      specialAccount: strOrNull(row.special_account),
      balance: num(row.final_balance),
    };
  }

  async findClientName(id: string): Promise<string | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT name FROM clients WHERE id = $1`,
      [id],
    );
    return row ? str(row.name) : null;
  }
}
