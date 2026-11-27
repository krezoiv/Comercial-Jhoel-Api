import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';
import {
  CashReservationSnapshot,
  PaymentGroupError,
  PaymentGroupEventRow,
  PaymentGroupItemRow,
  PaymentGroupSummaryRow,
  PaymentGroupTotals,
  paymentGroupErrorFromMessage,
} from '../../domain/payment-group';
import type {
  CreatePaymentGroupData,
  PaymentGroupFilters,
  PaymentGroupItemData,
  PaymentGroupRepository,
} from '../../domain/repositories/payment-group.repository';

type Row = Record<string, unknown>;
const num = (value: unknown): number => Number(value ?? 0);
const numOrNull = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);
const text = (value: unknown): string =>
  typeof value === 'string'
    ? value
    : value === null || value === undefined
      ? ''
      : JSON.stringify(value);
const str = (value: unknown): string | null =>
  value === null || value === undefined ? null : text(value);
const date = (value: unknown): Date | null =>
  value === null || value === undefined
    ? null
    : new Date(value as string | Date);
/** DATE columns come back as JS dates at local midnight: format them back to yyyy-MM-dd. */
const isoDate = (value: unknown): string => {
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return text(value).slice(0, 10);
};

/** Escapes LIKE wildcards of a user search. */
const likeTerm = (search: string): string =>
  search.replace(/[\\%_]/g, (c) => `\\${c}`);

const FILTERED = `
  FROM payment_group_balances b
  WHERE ($1::date IS NULL OR b.operation_date >= $1::date)
    AND ($2::date IS NULL OR b.operation_date <= $2::date)
    AND ($3::uuid IS NULL OR b.transaction_type_id = $3::uuid)
    AND ($4::text IS NULL OR b.display_status = $4::text)
    AND ($5::uuid IS NULL OR b.created_by = $5::uuid)
    AND ($6::text IS NULL OR b.description ILIKE '%' || $6::text || '%' OR b.code ILIKE '%' || $6::text || '%')
`;

const GROUP_COLUMNS = `
  b.*, t.name AS type_name, tb.name AS agent_name, bk.name AS account_name,
  cu.username AS created_username, clu.username AS closed_username, vu.username AS voided_username
`;
const GROUP_JOINS = `
  JOIN transaction_types t ON t.id = b.transaction_type_id
  LEFT JOIN transaction_banks tb ON tb.id = b.transaction_bank_id
  LEFT JOIN banks bk ON bk.id = b.bank_account_id
  JOIN users cu ON cu.id = b.created_by
  LEFT JOIN users clu ON clu.id = b.closed_by
  LEFT JOIN users vu ON vu.id = b.voided_by
`;

function toGroup(row: Row): PaymentGroupSummaryRow {
  return {
    id: text(row.id),
    code: text(row.code),
    number: num(row.number),
    transactionTypeId: text(row.transaction_type_id),
    transactionTypeName: text(row.type_name),
    cashDirection: text(
      row.cash_direction,
    ) as PaymentGroupSummaryRow['cashDirection'],
    description: text(row.description),
    operationDate: isoDate(row.operation_date),
    transactionBankId: str(row.transaction_bank_id),
    transactionBankName: str(row.agent_name),
    bankAccountId: str(row.bank_account_id),
    bankAccountName: str(row.account_name),
    authorizedAmount: num(row.authorized_amount),
    observations: str(row.observations),
    lifecycle: text(row.status) as PaymentGroupSummaryRow['lifecycle'],
    status: text(row.display_status) as PaymentGroupSummaryRow['status'],
    requiresApproval: row.requires_approval === true,
    // Approving closes the group: its close is the approval.
    approvedAt:
      row.requires_approval === true && text(row.status) === 'CERRADO'
        ? date(row.closed_at)
        : null,
    approvedByUsername:
      row.requires_approval === true && text(row.status) === 'CERRADO'
        ? str(row.closed_username)
        : null,
    itemCount: num(row.item_count),
    paidCount: num(row.paid_count),
    partialCount: num(row.partial_count),
    noPaymentCount: num(row.no_payment_count),
    pendingCount: num(row.pending_count),
    voidedCount: num(row.voided_count),
    unresolvedCount: num(row.unresolved_count),
    assignedAmount: num(row.assigned_amount),
    paidAmount: num(row.paid_amount),
    outstandingAmount: num(row.outstanding_amount),
    releasedAmount: num(row.released_amount),
    reservedAmount:
      text(row.cash_direction) === 'OUT' ? num(row.remaining_amount) : 0,
    closedAt: date(row.closed_at),
    closedByUsername: str(row.closed_username),
    closeNote: str(row.close_note),
    closingPaid: numOrNull(row.closing_paid),
    closingReleased: numOrNull(row.closing_released),
    voidedAt: date(row.voided_at),
    voidedByUsername: str(row.voided_username),
    voidReason: str(row.void_reason),
    createdBy: text(row.created_by),
    createdByUsername: text(row.created_username),
    createdAt: date(row.created_at)!,
  };
}

/**
 * Raw-SQL adapter of Pagos grupales. Reads come from the derived views
 * (`payment_group_balances`, `payment_group_item_balances`) and the official
 * Kardex; writes call the SQL functions of migration 1760009400000, which take
 * the Caja lock, apply the rules and append the history in one transaction.
 */
@Injectable()
export class TypeOrmPaymentGroupRepository implements PaymentGroupRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async findGroups(filters: PaymentGroupFilters) {
    const params = [
      filters.dateFrom ?? null,
      filters.dateTo ?? null,
      filters.transactionTypeId ?? null,
      filters.status ?? null,
      filters.createdBy ?? null,
      filters.search?.trim() ? likeTerm(filters.search.trim()) : null,
    ];
    const rows = await this.dataSource.query<Row[]>(
      `SELECT ${GROUP_COLUMNS}, count(*) OVER () AS total_count
       ${FILTERED.replace('FROM payment_group_balances b', `FROM payment_group_balances b ${GROUP_JOINS}`)}
       ORDER BY b.operation_date DESC, b.number DESC
       LIMIT $7 OFFSET $8`,
      [...params, filters.limit, (filters.page - 1) * filters.limit],
    );
    const [totals] = await this.dataSource.query<Row[]>(
      `SELECT count(*) AS groups,
              count(*) FILTER (WHERE b.display_status = 'PENDIENTE') AS pending,
              count(*) FILTER (WHERE b.display_status IN ('EN_PROCESO', 'PARCIAL')) AS in_process,
              count(*) FILTER (WHERE b.display_status = 'COMPLETADO') AS completed,
              COALESCE(SUM(b.remaining_amount) FILTER (WHERE b.cash_direction = 'OUT'), 0) AS reserved,
              COALESCE(SUM(b.paid_amount), 0) AS paid,
              COALESCE(SUM(b.outstanding_amount) FILTER (WHERE b.status = 'ABIERTO'), 0) AS outstanding,
              COALESCE(SUM(b.released_amount), 0) AS released
       ${FILTERED}`,
      params,
    );
    const summary: PaymentGroupTotals = {
      groups: num(totals?.groups),
      pending: num(totals?.pending),
      inProcess: num(totals?.in_process),
      completed: num(totals?.completed),
      reserved: num(totals?.reserved),
      paid: num(totals?.paid),
      outstanding: num(totals?.outstanding),
      released: num(totals?.released),
    };
    return {
      items: rows.map(toGroup),
      total: rows.length ? num(rows[0].total_count) : 0,
      totals: summary,
    };
  }

  async findGroup(id: string): Promise<PaymentGroupSummaryRow | null> {
    const [row] = await this.dataSource.query<Row[]>(
      `SELECT ${GROUP_COLUMNS} FROM payment_group_balances b ${GROUP_JOINS} WHERE b.id = $1`,
      [id],
    );
    return row ? toGroup(row) : null;
  }

  async findItems(groupId: string): Promise<PaymentGroupItemRow[]> {
    const rows = await this.dataSource.query<Row[]>(
      `SELECT i.*, ru.username AS resolved_username
       FROM payment_group_item_balances i
       LEFT JOIN users ru ON ru.id = i.resolved_by
       WHERE i.group_id = $1
       ORDER BY i.item_number`,
      [groupId],
    );
    const operations = await this.dataSource.query<Row[]>(
      `SELECT d.item_id, d.operation_id, d.amount, d.created_at, o.is_voided, u.username,
              (SELECT 'MOV-' || lpad(m.sequence::text, 6, '0') FROM cash_movements m
               WHERE m.reference_type = 'BANK_DEPOSIT' AND m.reference_id = d.operation_id AND m.movement_type <> 'ANULACION'
               ORDER BY m.sequence LIMIT 1) AS movement_number
       FROM payment_group_deliveries d
       JOIN bank_deposit_operations o ON o.id = d.operation_id
       JOIN users u ON u.id = d.created_by
       WHERE d.group_id = $1
       ORDER BY d.created_at`,
      [groupId],
    );
    return rows.map((row) => ({
      id: text(row.id),
      itemNumber: num(row.item_number),
      expectedAmount: num(row.expected_amount),
      paidAmount: num(row.paid_amount),
      outstandingAmount: num(row.outstanding_amount),
      releasedAmount: num(row.released_amount),
      reference: str(row.reference),
      creditNumber: str(row.credit_number),
      observation: str(row.observation),
      status: text(row.status) as PaymentGroupItemRow['status'],
      deliveryCount: num(row.delivery_count),
      lastPaidAt: date(row.last_paid_at),
      noPaymentAt: date(row.no_payment_at),
      resolution: str(row.resolution),
      resolvedAt: date(row.resolved_at),
      resolvedByUsername: str(row.resolved_username),
      voidedAt: date(row.voided_at),
      voidReason: str(row.void_reason),
      operations: operations
        .filter((op) => op.item_id === row.id)
        .map((op) => ({
          operationId: text(op.operation_id),
          amount: num(op.amount),
          movementNumber: str(op.movement_number),
          isVoided: op.is_voided === true,
          createdAt: date(op.created_at)!,
          username: text(op.username),
        })),
    }));
  }

  async findEvents(
    groupId: string,
    itemId?: string,
  ): Promise<PaymentGroupEventRow[]> {
    const rows = await this.dataSource.query<Row[]>(
      `SELECT e.*, i.item_number, u.username
       FROM payment_group_events e
       LEFT JOIN payment_group_items i ON i.id = e.item_id
       JOIN users u ON u.id = e.created_by
       WHERE e.group_id = $1 AND ($2::uuid IS NULL OR e.item_id = $2::uuid)
       ORDER BY e.created_at, e.id`,
      [groupId, itemId ?? null],
    );
    return rows.map((row) => ({
      id: text(row.id),
      itemId: str(row.item_id),
      itemNumber: numOrNull(row.item_number),
      eventType: text(row.event_type) as PaymentGroupEventRow['eventType'],
      itemStatus: str(row.item_status) as PaymentGroupEventRow['itemStatus'],
      groupStatus: str(row.group_status) as PaymentGroupEventRow['groupStatus'],
      amount: numOrNull(row.amount),
      note: str(row.note),
      operationId: str(row.operation_id),
      details:
        row.details && typeof row.details === 'object'
          ? (row.details as Record<string, unknown>)
          : null,
      username: text(row.username),
      createdAt: date(row.created_at)!,
    }));
  }

  async getCashSnapshot(): Promise<CashReservationSnapshot> {
    const [row] = await this.dataSource.query<Row[]>(
      `SELECT cash_balance() AS balance, cash_reserved_total() AS reserved, cash_available() AS available`,
    );
    return {
      balance: num(row?.balance),
      reserved: num(row?.reserved),
      available: num(row?.available),
    };
  }

  create(data: CreatePaymentGroupData): Promise<string> {
    return this.write<string>(
      'SELECT create_payment_group($1, $2, $3, $4, $5, $6, $7, $8, $9) AS v',
      [
        data.transactionTypeId,
        data.description,
        data.transactionBankId,
        data.bankAccountId,
        data.authorizedAmount,
        JSON.stringify(data.items),
        data.observations,
        data.userId,
        data.idempotencyKey,
      ],
    );
  }

  registerDelivery(
    groupId: string,
    itemId: string,
    amount: number,
    note: string | null,
    userId: string,
    idempotencyKey: string,
  ): Promise<string> {
    return this.write<string>(
      'SELECT register_payment_group_delivery($1, $2, $3, $4, $5, $6) AS v',
      [groupId, itemId, amount, note, userId, idempotencyKey],
    );
  }

  async markNoPayment(
    groupId: string,
    itemId: string,
    note: string,
    userId: string,
  ) {
    await this.write(
      'SELECT mark_payment_group_item_no_payment($1, $2, $3, $4) AS v',
      [groupId, itemId, note, userId],
    );
  }

  async addNote(
    groupId: string,
    itemId: string | null,
    note: string,
    userId: string,
  ) {
    await this.write('SELECT add_payment_group_note($1, $2, $3, $4) AS v', [
      groupId,
      itemId,
      note,
      userId,
    ]);
  }

  async updateItem(
    groupId: string,
    itemId: string,
    data: {
      expectedAmount?: number;
      reference?: string | null;
      note?: string | null;
    },
    userId: string,
  ) {
    await this.write(
      'SELECT update_payment_group_item($1, $2, $3, $4, $5, $6, $7) AS v',
      [
        groupId,
        itemId,
        data.expectedAmount ?? null,
        data.reference ?? null,
        data.reference !== undefined,
        data.note ?? null,
        userId,
      ],
    );
  }

  async resolveItem(
    groupId: string,
    itemId: string,
    resolution: string,
    release: boolean,
    userId: string,
  ) {
    await this.write(
      'SELECT resolve_payment_group_item($1, $2, $3, $4, $5) AS v',
      [groupId, itemId, resolution, release, userId],
    );
  }

  async voidItem(
    groupId: string,
    itemId: string,
    reason: string,
    moneyReturned: boolean,
    userId: string,
  ) {
    await this.write(
      'SELECT void_payment_group_item($1, $2, $3, $4, $5) AS v',
      [groupId, itemId, reason, moneyReturned, userId],
    );
  }

  async close(groupId: string, note: string | null, userId: string) {
    await this.write('SELECT close_payment_group($1, $2, $3) AS v', [
      groupId,
      note,
      userId,
    ]);
  }

  async voidGroup(groupId: string, reason: string, userId: string) {
    await this.write('SELECT void_payment_group($1, $2, $3) AS v', [
      groupId,
      reason,
      userId,
    ]);
  }

  async updatePending(
    groupId: string,
    data: {
      description: string;
      authorizedAmount: number;
      items: PaymentGroupItemData[];
      note: string | null;
    },
    userId: string,
  ) {
    await this.write(
      'SELECT update_pending_payment_group($1, $2, $3, $4, $5, $6) AS v',
      [
        groupId,
        data.description,
        data.authorizedAmount,
        JSON.stringify(data.items),
        data.note,
        userId,
      ],
    );
  }

  async approve(
    groupId: string,
    expectedAmount: number,
    expectedCount: number,
    userId: string,
    idempotencyKey: string,
  ) {
    await this.write('SELECT approve_payment_group($1, $2, $3, $4, $5) AS v', [
      groupId,
      expectedAmount,
      expectedCount,
      userId,
      idempotencyKey,
    ]);
  }

  private async write<T>(sql: string, params: unknown[]): Promise<T> {
    try {
      const [row] = await this.dataSource.query<{ v: T }[]>(sql, params);
      return row?.v;
    } catch (error) {
      throw this.translate(error);
    }
  }

  /** `RAISE '<CODE>:<detail>'` of the group functions — and of the Transaccionar operation they register — as domain errors. */
  private translate(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;
    const mapped: PaymentGroupError | null =
      paymentGroupErrorFromMessage(message);
    if (mapped) {
      return mapped;
    }
    const code = message.split(':')[0];
    if (
      ['TRANSACTION_BANK_INACTIVE', 'TRANSACTION_BANK_NOT_FOUND'].includes(code)
    ) {
      return new PaymentGroupError(
        code,
        'El banco agente del grupo ya no está activo: no se puede registrar la operación.',
        409,
      );
    }
    if (
      [
        'BANK_ACCOUNT_NOT_AVAILABLE',
        'BANK_ACCOUNT_REQUIRED',
        'GENESIS_ACCOUNT_NOT_CONFIGURED',
      ].includes(code)
    ) {
      return new PaymentGroupError(
        code,
        'La cuenta bancaria del grupo no está disponible para Transaccionar.',
        409,
      );
    }
    return bankMovementErrorFromMessage(message) ?? error;
  }
}
