import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
import {
  CashCountResult,
  CashCountRow,
  CashCustodyRepository,
  CashCustodySnapshot,
  DenominationRow,
  FindCashCountsOptions,
  FindTransfersOptions,
  CashCountDraft,
  CashCountDraftPayload,
  CashLocation,
  CustodyTransferRow,
  FindCustodyTransfersOptions,
  LocationInventory,
  RegisterWarehouseCashAuditData,
  RegisterWarehouseCashCountData,
  WarehouseCashAuditRow,
  WarehouseCashCountRow,
  LatestCashCountCandidate,
  LatestCashCountLookup,
  Paginated,
  RegisterCashCountData,
  RegisterTransferData,
  RegisterWithdrawalData,
  WarehouseMovementRow,
  WarehouseTransferRow,
  WarehouseWithdrawalRow,
} from '../../domain/repositories/cash-custody.repository';
import { cashControlErrorFromMessage } from '../../domain/errors/cash-control.errors';
import { bankMovementErrorFromMessage } from '../../../banks/domain/errors/bank-movement.errors';

type SqlRow = Record<string, unknown>;

function text(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return typeof value === 'number' ||
    typeof value === 'bigint' ||
    typeof value === 'boolean'
    ? value.toString()
    : JSON.stringify(value);
}

function textOrNull(value: unknown): string | null {
  return value === null || value === undefined ? null : text(value);
}

function num(value: unknown): number {
  return value === null || value === undefined ? 0 : Number(value);
}

function numOrNull(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

function toDetails(value: unknown): DenominationRow[] {
  return ((value as SqlRow[] | null) ?? []).map((row) => ({
    denomination: num(row.denomination),
    quantity: num(row.quantity),
    subtotal: num(row.subtotal),
  }));
}

const TRANSFER_SELECT = `
  SELECT t.*, to_char(t.business_date, 'YYYY-MM-DD') AS business_date_text,
         cu.username AS created_by_username, vu.username AS voided_by_username,
         cm.sequence AS cash_sequence, wm.sequence AS warehouse_sequence,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM cash_movement_details d WHERE d.movement_id = t.cash_movement_id), '[]') AS details
  FROM cash_warehouse_transfers t
  JOIN users cu ON cu.id = t.created_by
  LEFT JOIN users vu ON vu.id = t.voided_by
  JOIN cash_movements cm ON cm.id = t.cash_movement_id
  JOIN warehouse_cash_movements wm ON wm.id = t.warehouse_movement_id
`;

const WITHDRAWAL_SELECT = `
  SELECT w.*, to_char(w.business_date, 'YYYY-MM-DD') AS business_date_text,
         cu.username AS created_by_username, vu.username AS voided_by_username,
         b.name AS bank_name, b.account_number AS bank_account_number,
         wm.sequence AS warehouse_sequence, cm.sequence AS cash_sequence,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM warehouse_cash_movement_details d WHERE d.movement_id = w.warehouse_movement_id), '[]') AS details
  FROM warehouse_cash_withdrawals w
  JOIN users cu ON cu.id = w.created_by
  LEFT JOIN users vu ON vu.id = w.voided_by
  LEFT JOIN banks b ON b.id = w.bank_id
  JOIN warehouse_cash_movements wm ON wm.id = w.warehouse_movement_id
  LEFT JOIN cash_movements cm ON cm.id = w.cash_movement_id
`;

const WAREHOUSE_COUNT_SELECT = `
  SELECT w.*, to_char(w.business_date, 'YYYY-MM-DD') AS business_date_text, u.username,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM warehouse_cash_count_details d WHERE d.count_id = w.id), '[]') AS details
  FROM warehouse_cash_counts w JOIN users u ON u.id = w.created_by
`;

/** Arqueos de Bodega (control counts with difference, migration 1760009100000). */
const WAREHOUSE_AUDIT_SELECT = `
  SELECT a.*, to_char(a.business_date, 'YYYY-MM-DD') AS business_date_text, u.username,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM warehouse_cash_audit_details d WHERE d.audit_id = a.id), '[]') AS details
  FROM warehouse_cash_audits a JOIN users u ON u.id = a.created_by
`;

/**
 * Deliveries caja → Bodega and withdrawals Bodega → caja / bank in one shape,
 * each with its own breakdown (caja-side details for deliveries, Bodega-side
 * details for withdrawals — where the writers store them).
 */
const CUSTODY_TRANSFERS_UNION = `
  SELECT t.id, 'CAJA_A_BODEGA'::text AS kind, t.reference_number, 'CAJA'::text AS origin, 'BODEGA'::text AS destination,
         NULL::text AS bank_name, t.amount,
         CASE t.status WHEN 'APLICADA' THEN 'APLICADO' ELSE 'ANULADO' END AS status,
         t.delivered_by, t.received_by, t.voucher_reference, t.observations, t.has_breakdown, t.business_date,
         t.created_by, t.created_at, t.voided_at, t.void_reason,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM cash_movement_details d WHERE d.movement_id = t.cash_movement_id), '[]') AS details,
         cm.previous_balance AS cash_before, cm.new_balance AS cash_after,
         wm.previous_balance AS warehouse_before, wm.new_balance AS warehouse_after
  FROM cash_warehouse_transfers t
  LEFT JOIN cash_movements cm ON cm.id = t.cash_movement_id
  LEFT JOIN warehouse_cash_movements wm ON wm.id = t.warehouse_movement_id
  UNION ALL
  SELECT w.id, CASE w.destination WHEN 'CAJA' THEN 'BODEGA_A_CAJA' ELSE 'BODEGA_A_BANCO' END, w.reference_number,
         'BODEGA', w.destination, b.name, w.amount, w.status,
         w.delivered_by, w.received_by, w.voucher_reference, w.observations, w.has_breakdown, w.business_date,
         w.created_by, w.created_at, w.voided_at, w.void_reason,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM warehouse_cash_movement_details d WHERE d.movement_id = w.warehouse_movement_id), '[]'),
         cm.previous_balance, cm.new_balance, wm.previous_balance, wm.new_balance
  FROM warehouse_cash_withdrawals w LEFT JOIN banks b ON b.id = w.bank_id
  LEFT JOIN cash_movements cm ON cm.id = w.cash_movement_id
  LEFT JOIN warehouse_cash_movements wm ON wm.id = w.warehouse_movement_id
`;

const COUNT_SELECT = `
  SELECT c.*, to_char(c.business_date, 'YYYY-MM-DD') AS business_date_text, u.username,
         COALESCE((SELECT json_agg(json_build_object('denomination', d.denomination, 'quantity', d.quantity,
                     'subtotal', d.subtotal) ORDER BY d.denomination DESC)
                   FROM cash_count_details d WHERE d.count_id = c.id), '[]') AS details
  FROM cash_counts c JOIN users u ON u.id = c.created_by
`;

/**
 * Raw-SQL adapter of the custody port: reads are plain SELECTs; writes call
 * `register_cash_warehouse_transfer`, `void_cash_warehouse_transfer`,
 * `register_warehouse_initial_balance` and `register_cash_count`, whose
 * `RAISE EXCEPTION` codes are mapped to the cash-control domain errors.
 */
@Injectable()
export class TypeOrmCashCustodyRepository implements CashCustodyRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getCustody(): Promise<CashCustodySnapshot> {
    const [row] = await this.dataSource.query<SqlRow[]>(`
      SELECT cash_balance() AS cash, warehouse_cash_balance() AS warehouse,
             EXISTS (SELECT 1 FROM warehouse_cash_movements WHERE movement_type = 'SALDO_INICIAL' AND status = 'VIGENTE') AS has_initial,
             (SELECT max(created_at) FROM warehouse_cash_movements) AS last_at,
             to_char(d.business_date, 'YYYY-MM-DD') AS business_date, d.is_open,
             (SELECT COALESCE(sum(CASE WHEN w.direction = 'IN' THEN w.amount ELSE -w.amount END), 0)
              FROM warehouse_cash_movements w
              WHERE w.reference_type = 'WAREHOUSE_TRANSFER' AND w.day_opening_id = d.day_opening_id) AS delivered_today,
             (SELECT COALESCE(sum(x.amount), 0) FROM warehouse_cash_withdrawals x
              WHERE x.status = 'APLICADO' AND x.destination = 'CAJA' AND x.day_opening_id = d.day_opening_id) AS returned_today,
             (SELECT COALESCE(sum(x.amount), 0) FROM warehouse_cash_withdrawals x
              WHERE x.status = 'APLICADO' AND x.destination = 'BANCO' AND x.day_opening_id = d.day_opening_id) AS deposited_today
      FROM (SELECT 1) x LEFT JOIN LATERAL (SELECT * FROM cash_current_bank_day()) d ON true
    `);
    const cash = num(row.cash);
    const warehouse = num(row.warehouse);
    return {
      cashBalance: cash,
      warehouseBalance: warehouse,
      custodyTotal: Math.round((cash + warehouse) * 100) / 100,
      warehouseHasInitialBalance: row.has_initial === true,
      warehouseLastMovementAt: (row.last_at as Date | null) ?? null,
      currentDay: row.business_date
        ? {
            businessDate: text(row.business_date),
            isOpen: row.is_open === true,
          }
        : null,
      deliveredToday: num(row.delivered_today),
      returnedToCashToday: num(row.returned_today),
      depositedToBankToday: num(row.deposited_today),
    };
  }

  async registerTransfer(data: RegisterTransferData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_cash_warehouse_transfer($1, $2::jsonb, $3, $4, $5, $6, $7, $8) AS id`,
      [
        data.amount,
        data.details.length ? JSON.stringify(data.details) : null,
        data.deliveredBy,
        data.receivedBy,
        data.voucherReference ?? null,
        data.observations ?? null,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async voidTransfer(
    id: string,
    userId: string,
    reason: string,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT void_cash_warehouse_transfer($1, $2, $3) AS id`,
      [id, userId, reason],
    );
    return text(row.id);
  }

  async findTransfers(
    options: FindTransfersOptions,
  ): Promise<Paginated<WarehouseTransferRow>> {
    const where: string[] = [];
    const params: unknown[] = [];
    if (options.dateFrom) {
      params.push(options.dateFrom);
      where.push(`t.business_date >= $${params.length}::date`);
    }
    if (options.dateTo) {
      params.push(options.dateTo);
      where.push(`t.business_date <= $${params.length}::date`);
    }
    if (options.status) {
      params.push(options.status);
      where.push(`t.status = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM cash_warehouse_transfers t ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${TRANSFER_SELECT} ${whereSql} ORDER BY t.number DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map((r) => this.toTransfer(r)),
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  async findTransferById(id: string): Promise<WarehouseTransferRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${TRANSFER_SELECT} WHERE t.id = $1`,
      [id],
    );
    return row ? this.toTransfer(row) : null;
  }

  async registerWarehouseInitialBalance(
    amount: number,
    userId: string,
    reason: string,
    idempotencyKey: string,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_warehouse_initial_balance($1, $2, $3, $4) AS id`,
      [amount, userId, reason, idempotencyKey],
    );
    return text(row.id);
  }

  async findWarehouseMovements(
    page: number,
    limit: number,
  ): Promise<Paginated<WarehouseMovementRow>> {
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM warehouse_cash_movements`,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `SELECT w.*, to_char(w.business_date, 'YYYY-MM-DD') AS business_date_text, u.username,
              COALESCE(t.reference_number, x.reference_number) AS transfer_reference
       FROM warehouse_cash_movements w
       JOIN users u ON u.id = w.created_by
       LEFT JOIN cash_warehouse_transfers t ON w.reference_type = 'WAREHOUSE_TRANSFER' AND t.id = w.reference_id
       LEFT JOIN warehouse_cash_withdrawals x ON w.reference_type = 'WAREHOUSE_WITHDRAWAL' AND x.id = w.reference_id
       ORDER BY w.sequence DESC LIMIT $1 OFFSET $2`,
      [limit, (page - 1) * limit],
    );
    return {
      items: rows.map((row) => ({
        id: text(row.id),
        sequence: num(row.sequence),
        businessDate: textOrNull(row.business_date_text),
        movementType: text(
          row.movement_type,
        ) as WarehouseMovementRow['movementType'],
        direction: text(row.direction) as WarehouseMovementRow['direction'],
        amount: num(row.amount),
        previousBalance: num(row.previous_balance),
        newBalance: num(row.new_balance),
        referenceType: textOrNull(row.reference_type),
        referenceId: textOrNull(row.reference_id),
        transferReference: textOrNull(row.transfer_reference),
        description: text(row.description),
        counterpart: textOrNull(row.counterpart),
        reason: textOrNull(row.reason),
        status: text(row.status) as WarehouseMovementRow['status'],
        createdByUsername: text(row.username),
        createdAt: row.created_at as Date,
      })),
      total: num(count?.total),
      page,
      limit,
    };
  }

  async registerWithdrawal(data: RegisterWithdrawalData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_warehouse_withdrawal($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10) AS id`,
      [
        data.destination,
        data.amount,
        data.details.length ? JSON.stringify(data.details) : null,
        data.bankId ?? null,
        data.deliveredBy,
        data.receivedBy,
        data.voucherReference ?? null,
        data.observations ?? null,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async voidWithdrawal(
    id: string,
    userId: string,
    reason: string,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT void_warehouse_withdrawal($1, $2, $3) AS id`,
      [id, userId, reason],
    );
    return text(row.id);
  }

  async findWithdrawals(
    options: FindTransfersOptions,
  ): Promise<Paginated<WarehouseWithdrawalRow>> {
    const where: string[] = [];
    const params: unknown[] = [];
    if (options.dateFrom) {
      params.push(options.dateFrom);
      where.push(`w.business_date >= $${params.length}::date`);
    }
    if (options.dateTo) {
      params.push(options.dateTo);
      where.push(`w.business_date <= $${params.length}::date`);
    }
    if (options.status) {
      params.push(options.status === 'ANULADA' ? 'ANULADO' : 'APLICADO');
      where.push(`w.status = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM warehouse_cash_withdrawals w ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${WITHDRAWAL_SELECT} ${whereSql} ORDER BY w.number DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map((r) => this.toWithdrawal(r)),
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  async findWithdrawalById(id: string): Promise<WarehouseWithdrawalRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${WITHDRAWAL_SELECT} WHERE w.id = $1`,
      [id],
    );
    return row ? this.toWithdrawal(row) : null;
  }

  private toWithdrawal(row: SqlRow): WarehouseWithdrawalRow {
    return {
      id: text(row.id),
      referenceNumber: text(row.reference_number),
      destination: text(
        row.destination,
      ) as WarehouseWithdrawalRow['destination'],
      amount: num(row.amount),
      bankId: textOrNull(row.bank_id),
      bankName: textOrNull(row.bank_name),
      bankAccountNumber: textOrNull(row.bank_account_number),
      deliveredBy: text(row.delivered_by),
      receivedBy: text(row.received_by),
      voucherReference: textOrNull(row.voucher_reference),
      observations: textOrNull(row.observations),
      hasBreakdown: row.has_breakdown === true,
      businessDate: text(row.business_date_text),
      warehouseMovementId: text(row.warehouse_movement_id),
      warehouseMovementSequence: num(row.warehouse_sequence),
      cashMovementId: textOrNull(row.cash_movement_id),
      cashMovementSequence: numOrNull(row.cash_sequence),
      bankMovementId: textOrNull(row.bank_movement_id),
      status: text(row.status) as WarehouseWithdrawalRow['status'],
      voidedAt: (row.voided_at as Date | null) ?? null,
      voidedByUsername: textOrNull(row.voided_by_username),
      voidReason: textOrNull(row.void_reason),
      createdByUsername: text(row.created_by_username),
      createdAt: row.created_at as Date,
      details: toDetails(row.details),
    };
  }

  async registerCount(data: RegisterCashCountData): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_cash_count($1::jsonb, $2, $3, $4, $5, $6, $7) AS id`,
      [
        JSON.stringify(data.details),
        data.observations ?? null,
        // Bodega is never counted in an Arqueo de Caja (migration 1760008800000).
        null,
        data.userId,
        data.idempotencyKey,
        data.replacesId ?? null,
        data.correctionReason ?? null,
      ],
    );
    return text(row.id);
  }

  async findCounts(
    options: FindCashCountsOptions,
  ): Promise<Paginated<CashCountRow>> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replace('?', `$${params.length}`));
    };
    if (options.dateFrom)
      add(
        `(c.counted_at AT TIME ZONE 'America/Guatemala')::date >= ?::date`,
        options.dateFrom,
      );
    if (options.dateTo)
      add(
        `(c.counted_at AT TIME ZONE 'America/Guatemala')::date <= ?::date`,
        options.dateTo,
      );
    if (options.businessDate)
      add('c.business_date = ?::date', options.businessDate);
    if (options.userId) add('c.created_by = ?::uuid', options.userId);
    if (options.result) add('c.result = ?', options.result);
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM cash_counts c ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${COUNT_SELECT} ${whereSql} ORDER BY c.number DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map((r) => this.toCount(r)),
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  async findCountById(id: string): Promise<CashCountRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${COUNT_SELECT} WHERE c.id = $1`,
      [id],
    );
    return row ? this.toCount(row) : null;
  }

  async findLatestValidCount(
    preferredBusinessDate: string | null,
  ): Promise<LatestCashCountLookup> {
    const [day] = await this.dataSource.query<SqlRow[]>(
      `SELECT to_char(COALESCE($1::date, (SELECT business_date FROM cash_current_bank_day())), 'YYYY-MM-DD') AS day`,
      [preferredBusinessDate],
    );
    const referenceBusinessDate = textOrNull(day?.day);
    // `cash_latest_count_candidate` returns ONE count record with its own
    // details — the two cuts of a day are never grouped or added together.
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT *, to_char(business_date, 'YYYY-MM-DD') AS business_date_text
       FROM cash_latest_count_candidate($1::date)`,
      [referenceBusinessDate],
    );
    return {
      count: row
        ? {
            source: text(row.source) as LatestCashCountCandidate['source'],
            id: text(row.id),
            number: numOrNull(row.number),
            cutPeriodId: textOrNull(row.cut_period_id),
            cutNumber: numOrNull(row.cut_number) as 1 | 2 | null,
            businessDate: text(row.business_date_text),
            countedAt: row.counted_at as Date,
            totalCounted: num(row.total_counted),
            createdByUsername: text(row.username),
            details: toDetails(row.details),
          }
        : null,
      referenceBusinessDate,
    };
  }

  // ── Inventario por denominación (1760007800000) ───────────────────────────

  async getInventory(location: CashLocation): Promise<LocationInventory> {
    const [summary] = await this.dataSource.query<SqlRow[]>(
      `SELECT s.*, u.username AS anchor_username
       FROM cash_location_inventory_summary($1) s LEFT JOIN users u ON u.id = s.anchor_by`,
      [location],
    );
    const lines = await this.dataSource.query<SqlRow[]>(
      `SELECT denomination, quantity FROM cash_location_inventory($1)`,
      [location],
    );
    return {
      location,
      hasAnchor: summary?.has_anchor === true,
      anchorKind:
        (textOrNull(summary?.anchor_kind) as LocationInventory['anchorKind']) ??
        null,
      anchorId: textOrNull(summary?.anchor_id),
      anchorNumber: numOrNull(summary?.anchor_number),
      anchorAt: (summary?.anchor_at as Date | null) ?? null,
      anchorByUsername: textOrNull(summary?.anchor_username),
      balance: num(summary?.balance),
      knownTotal: num(summary?.known_total),
      unbroken: num(summary?.unbroken),
      lines: lines.map((r) => {
        const denomination = num(r.denomination);
        const quantity = num(r.quantity);
        return {
          denomination,
          quantity,
          subtotal: Math.round(denomination * 100 * quantity) / 100,
        };
      }),
    };
  }

  async registerWarehouseCount(
    data: RegisterWarehouseCashCountData,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_warehouse_cash_count($1::jsonb, $2, $3, $4) AS id`,
      [
        JSON.stringify(data.details),
        data.observations ?? null,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async findWarehouseCounts(
    page: number,
    limit: number,
  ): Promise<Paginated<WarehouseCashCountRow>> {
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM warehouse_cash_counts`,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${WAREHOUSE_COUNT_SELECT} ORDER BY w.number DESC LIMIT $1 OFFSET $2`,
      [limit, (page - 1) * limit],
    );
    return {
      items: rows.map((r) => this.toWarehouseCount(r)),
      total: num(count?.total),
      page,
      limit,
    };
  }

  async findWarehouseCountById(
    id: string,
  ): Promise<WarehouseCashCountRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${WAREHOUSE_COUNT_SELECT} WHERE w.id = $1`,
      [id],
    );
    return row ? this.toWarehouseCount(row) : null;
  }

  // ── Arqueo de Bodega (control con diferencia) ───────────────────────────

  async registerWarehouseAudit(
    data: RegisterWarehouseCashAuditData,
  ): Promise<string> {
    const [row] = await this.write<SqlRow[]>(
      `SELECT register_warehouse_cash_audit($1::jsonb, $2, $3, $4) AS id`,
      [
        JSON.stringify(data.details),
        data.observations ?? null,
        data.userId,
        data.idempotencyKey,
      ],
    );
    return text(row.id);
  }

  async findWarehouseAudits(
    page: number,
    limit: number,
  ): Promise<Paginated<WarehouseCashAuditRow>> {
    const [count] = await this.dataSource.query<SqlRow[]>(
      `SELECT count(*) AS total FROM warehouse_cash_audits`,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `${WAREHOUSE_AUDIT_SELECT} ORDER BY a.number DESC LIMIT $1 OFFSET $2`,
      [limit, (page - 1) * limit],
    );
    return {
      items: rows.map((r) => this.toWarehouseAudit(r)),
      total: num(count?.total),
      page,
      limit,
    };
  }

  async findWarehouseAuditById(
    id: string,
  ): Promise<WarehouseCashAuditRow | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `${WAREHOUSE_AUDIT_SELECT} WHERE a.id = $1`,
      [id],
    );
    return row ? this.toWarehouseAudit(row) : null;
  }

  private toWarehouseAudit(row: SqlRow): WarehouseCashAuditRow {
    return {
      id: text(row.id),
      number: num(row.number),
      countedAt: row.counted_at as Date,
      businessDate: text(row.business_date_text),
      theoreticalBalance: num(row.theoretical_balance),
      totalCounted: num(row.total_counted),
      difference: num(row.difference),
      result: text(row.result) as CashCountResult,
      observations: textOrNull(row.observations),
      createdByUsername: text(row.username),
      details: toDetails(row.details),
    };
  }

  // ── Borradores del Arqueo de Caja (por usuario × día bancario actual) ─────

  async getCountDraft(userId: string): Promise<CashCountDraft | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `SELECT d.payload, d.version, d.updated_at, to_char(d.business_date, 'YYYY-MM-DD') AS business_date
       FROM cash_count_drafts d JOIN cash_current_bank_day() b ON b.day_opening_id = d.day_opening_id
       WHERE d.user_id = $1`,
      [userId],
    );
    return row ? this.toDraft(row) : null;
  }

  async saveCountDraft(
    userId: string,
    payload: CashCountDraftPayload,
  ): Promise<CashCountDraft | null> {
    const [row] = await this.dataSource.query<SqlRow[]>(
      `INSERT INTO cash_count_drafts (user_id, day_opening_id, business_date, payload)
       SELECT $1, b.day_opening_id, b.business_date, $2::jsonb
       FROM cash_current_bank_day() b WHERE b.day_opening_id IS NOT NULL AND b.is_open
       ON CONFLICT (user_id, day_opening_id)
       DO UPDATE SET payload = EXCLUDED.payload, version = cash_count_drafts.version + 1, updated_at = now()
       RETURNING payload, version, updated_at, to_char(business_date, 'YYYY-MM-DD') AS business_date`,
      [userId, JSON.stringify(payload)],
    );
    return row ? this.toDraft(row) : null;
  }

  async deleteCountDraft(userId: string): Promise<void> {
    await this.dataSource.query(
      `DELETE FROM cash_count_drafts d USING cash_current_bank_day() b
       WHERE d.user_id = $1 AND d.day_opening_id = b.day_opening_id`,
      [userId],
    );
  }

  // ── Historial unificado de traslados caja ↔ Bodega ────────────────────────

  async findCustodyTransfers(
    options: FindCustodyTransfersOptions,
  ): Promise<Paginated<CustodyTransferRow>> {
    const where: string[] = [];
    const params: unknown[] = [];
    const add = (clause: string, value: unknown) => {
      params.push(value);
      where.push(clause.replace('?', `$${params.length}`));
    };
    if (options.kind) add('x.kind = ?', options.kind);
    if (options.userId) add('x.created_by = ?::uuid', options.userId);
    if (options.status) add('x.status = ?', options.status);
    if (options.dateFrom)
      add(
        `(x.created_at AT TIME ZONE 'America/Guatemala')::date >= ?::date`,
        options.dateFrom,
      );
    if (options.dateTo)
      add(
        `(x.created_at AT TIME ZONE 'America/Guatemala')::date <= ?::date`,
        options.dateTo,
      );
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [count] = await this.dataSource.query<SqlRow[]>(
      `WITH x AS (${CUSTODY_TRANSFERS_UNION}) SELECT count(*) AS total FROM x ${whereSql}`,
      params,
    );
    const rows = await this.dataSource.query<SqlRow[]>(
      `WITH x AS (${CUSTODY_TRANSFERS_UNION})
       SELECT x.*, to_char(x.business_date, 'YYYY-MM-DD') AS business_date_text, u.username AS created_by_username
       FROM x JOIN users u ON u.id = x.created_by ${whereSql}
       ORDER BY x.created_at DESC, x.reference_number DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, options.limit, (options.page - 1) * options.limit],
    );
    return {
      items: rows.map((r) => ({
        id: text(r.id),
        kind: text(r.kind) as CustodyTransferRow['kind'],
        referenceNumber: text(r.reference_number),
        origin: text(r.origin) as CustodyTransferRow['origin'],
        destination: text(r.destination) as CustodyTransferRow['destination'],
        bankName: textOrNull(r.bank_name),
        amount: num(r.amount),
        status: text(r.status) as CustodyTransferRow['status'],
        deliveredBy: text(r.delivered_by),
        receivedBy: text(r.received_by),
        voucherReference: textOrNull(r.voucher_reference),
        observations: textOrNull(r.observations),
        hasBreakdown: r.has_breakdown === true,
        businessDate: text(r.business_date_text),
        createdById: text(r.created_by),
        createdByUsername: text(r.created_by_username),
        createdAt: r.created_at as Date,
        voidedAt: (r.voided_at as Date | null) ?? null,
        voidReason: textOrNull(r.void_reason),
        cashBalanceBefore: numOrNull(r.cash_before),
        cashBalanceAfter: numOrNull(r.cash_after),
        warehouseBalanceBefore: numOrNull(r.warehouse_before),
        warehouseBalanceAfter: numOrNull(r.warehouse_after),
        details: toDetails(r.details),
      })),
      total: num(count?.total),
      page: options.page,
      limit: options.limit,
    };
  }

  private toWarehouseCount(row: SqlRow): WarehouseCashCountRow {
    return {
      id: text(row.id),
      number: num(row.number),
      countedAt: row.counted_at as Date,
      businessDate: text(row.business_date_text),
      warehouseBalance: num(row.warehouse_balance),
      totalCounted: num(row.total_counted),
      observations: textOrNull(row.observations),
      createdByUsername: text(row.username),
      details: toDetails(row.details),
    };
  }

  private toDraft(row: SqlRow): CashCountDraft {
    const p = (row.payload ?? {}) as Partial<CashCountDraftPayload>;
    return {
      businessDate: text(row.business_date),
      payload: {
        details: Array.isArray(p.details)
          ? p.details.map((d) => ({
              denomination: num(d.denomination),
              quantity: num(d.quantity),
            }))
          : [],
        // Older drafts may still carry a Bodega count: it is ignored.
        observations: p.observations ?? null,
      },
      version: num(row.version),
      updatedAt: row.updated_at as Date,
    };
  }

  private toTransfer(row: SqlRow): WarehouseTransferRow {
    return {
      id: text(row.id),
      referenceNumber: text(row.reference_number),
      amount: num(row.amount),
      deliveredBy: text(row.delivered_by),
      receivedBy: text(row.received_by),
      voucherReference: textOrNull(row.voucher_reference),
      observations: textOrNull(row.observations),
      hasBreakdown: row.has_breakdown === true,
      businessDate: text(row.business_date_text),
      cashMovementId: text(row.cash_movement_id),
      cashMovementSequence: num(row.cash_sequence),
      warehouseMovementId: text(row.warehouse_movement_id),
      warehouseMovementSequence: num(row.warehouse_sequence),
      status: text(row.status) as WarehouseTransferRow['status'],
      voidedAt: (row.voided_at as Date | null) ?? null,
      voidedByUsername: textOrNull(row.voided_by_username),
      voidReason: textOrNull(row.void_reason),
      createdByUsername: text(row.created_by_username),
      createdAt: row.created_at as Date,
      details: toDetails(row.details),
    };
  }

  private toCount(row: SqlRow): CashCountRow {
    const totalCounted = num(row.total_counted);
    const warehouseBalance = num(row.warehouse_balance);
    const warehouseCounted = numOrNull(row.warehouse_counted);
    const custodyTheoretical = num(row.custody_theoretical);
    const custodyCounted =
      Math.round(
        (totalCounted + (warehouseCounted ?? warehouseBalance)) * 100,
      ) / 100;
    return {
      id: text(row.id),
      number: num(row.number),
      businessDate: text(row.business_date_text),
      countedAt: row.counted_at as Date,
      systemCash: num(row.system_cash),
      totalCounted,
      difference: num(row.difference),
      result: text(row.result) as CashCountResult,
      warehouseBalance,
      warehouseCounted,
      warehouseDifference: numOrNull(row.warehouse_difference),
      custodyTheoretical,
      custodyCounted,
      custodyDifference:
        warehouseCounted === null
          ? null
          : Math.round((custodyCounted - custodyTheoretical) * 100) / 100,
      observations: textOrNull(row.observations),
      status: text(row.status) as CashCountRow['status'],
      replacesId: textOrNull(row.replaces_id),
      replacedById: textOrNull(row.replaced_by_id),
      correctionReason: textOrNull(row.correction_reason),
      createdByUsername: text(row.username),
      createdAt: row.created_at as Date,
      details: toDetails(row.details),
    };
  }

  private async write<T>(sql: string, params: unknown[]): Promise<T> {
    try {
      return await this.dataSource.query<T>(sql, params);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // Custody rules first; a deposit from Bodega can also hit the bank account's own rules.
        const mapped =
          cashControlErrorFromMessage(error.message) ??
          bankMovementErrorFromMessage(error.message);
        if (mapped) {
          throw mapped;
        }
      }
      throw error;
    }
  }
}
