import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import {
  BankAccountMovement,
  BankMovementOrigin,
  BankMovementStatus,
  BankMovementType,
  BankTransfer,
  BankTransferKind,
} from '../../domain/entities/bank-account-movement.entity';
import {
  AdjustBankBalanceData,
  BankBalanceCreditResult,
  BankMovementFilters,
  BankMovementRepository,
  BankTransferFilters,
  BankTransfersSummary,
  LastBankMovement,
  PaginatedBankTransfers,
  PaginatedBankMovements,
  RegisterBankBalanceCreditData,
  RegisterBankTransferData,
} from '../../domain/repositories/bank-movement.repository';
import {
  BankTransferNotFoundError,
  bankMovementErrorFromMessage,
} from '../../domain/errors/bank-movement.errors';
import { BankNotFoundError } from '../../domain/errors/bank-not-found.error';
import { BankInactiveError } from '../../domain/errors/bank-inactive.error';
import { BankOrmEntity } from './bank.orm-entity';

interface MovementRow {
  id: string;
  sequence: string;
  bank_id: string;
  bank_name: string;
  account_number: string;
  account_type_name: string;
  movement_type: BankMovementType;
  origin: BankMovementOrigin;
  amount: string;
  balance_before: string;
  balance_after: string;
  business_date: string;
  created_at: Date;
  user_id: string;
  username: string | null;
  reference_type: string | null;
  reference_id: string | null;
  reference_text: string | null;
  concept: string | null;
  observation: string | null;
  counterpart_bank_id: string | null;
  counterpart_bank_name: string | null;
  counterpart_account_number: string | null;
  status: BankMovementStatus;
  reversal_of_id: string | null;
  reversed_at: Date | null;
  reversed_by_username: string | null;
}

interface TransferRow {
  id: string;
  kind: BankTransferKind;
  business_date: string;
  created_at: Date;
  amount: string;
  user_id: string;
  username: string | null;
  reference_text: string | null;
  concept: string | null;
  status: BankMovementStatus;
  source_bank_id: string;
  source_bank_name: string;
  source_account_number: string;
  source_balance_before: string;
  source_balance_after: string;
  destination_bank_id: string | null;
  destination_bank_name: string | null;
  destination_account_number: string | null;
  destination_balance_before: string | null;
  destination_balance_after: string | null;
}

// `numeric` llega como string desde pg — mismo motivo que
// `DecimalColumnTransformer`; las cantidades de este dominio nunca se
// acercan al límite de precisión de un `number`.
const MOVEMENT_SELECT = `
  SELECT
    m.id, m.sequence, m.bank_id, b.name AS bank_name, b.account_number,
    at.name AS account_type_name, m.movement_type, m.origin,
    m.amount, m.balance_before, m.balance_after,
    to_char(m.business_date, 'YYYY-MM-DD') AS business_date, m.created_at,
    m.user_id, u.username, m.reference_type, m.reference_id, m.reference_text,
    m.concept, m.observation, m.counterpart_bank_id,
    cb.name AS counterpart_bank_name, cb.account_number AS counterpart_account_number,
    m.status, m.reversal_of_id, m.reversed_at, ru.username AS reversed_by_username
  FROM bank_account_movements m
  JOIN banks b ON b.id = m.bank_id
  JOIN account_types at ON at.id = b.account_type_id
  JOIN users u ON u.id = m.user_id
  LEFT JOIN banks cb ON cb.id = m.counterpart_bank_id
  LEFT JOIN users ru ON ru.id = m.reversed_by
`;

// Salida (`s`) + entrada opcional (`e`): un retiro de efectivo en banco
// (`RETIRO_EFECTIVO`) no tiene entrada, por eso LEFT JOIN y destino nulo.
const TRANSFER_SELECT = `
  SELECT
    s.reference_id AS id,
    CASE WHEN s.movement_type = 'RETIRO_EFECTIVO' THEN 'CASH_WITHDRAWAL' ELSE 'TRANSFER' END AS kind,
    to_char(s.business_date, 'YYYY-MM-DD') AS business_date,
    s.created_at, -s.amount AS amount, s.user_id, u.username,
    s.reference_text, s.concept, s.status,
    s.bank_id AS source_bank_id, sb.name AS source_bank_name, sb.account_number AS source_account_number,
    s.balance_before AS source_balance_before, s.balance_after AS source_balance_after,
    e.bank_id AS destination_bank_id, db.name AS destination_bank_name, db.account_number AS destination_account_number,
    e.balance_before AS destination_balance_before, e.balance_after AS destination_balance_after
  FROM bank_account_movements s
  LEFT JOIN bank_account_movements e
    ON e.reference_type = 'BANK_TRANSFER'
   AND e.reference_id = s.reference_id
   AND e.movement_type = 'TRANSFERENCIA_ENTRADA'
  JOIN banks sb ON sb.id = s.bank_id
  LEFT JOIN banks db ON db.id = e.bank_id
  JOIN users u ON u.id = s.user_id
  WHERE s.reference_type = 'BANK_TRANSFER'
    AND s.movement_type IN ('TRANSFERENCIA_SALIDA', 'RETIRO_EFECTIVO')
`;

@Injectable()
export class TypeOrmBankMovementRepository implements BankMovementRepository {
  constructor(
    @InjectRepository(BankOrmEntity)
    private readonly bankRepository: Repository<BankOrmEntity>,
  ) {}

  private get manager() {
    return this.bankRepository.manager;
  }

  async registerTransfer(data: RegisterBankTransferData): Promise<string> {
    try {
      const rows = await this.manager.query<
        { register_bank_transfer: string }[]
      >('SELECT register_bank_transfer($1, $2, $3, $4, $5, $6, $7)', [
        data.sourceBankId,
        data.destinationBankId,
        data.amount,
        data.businessDate,
        data.userId,
        data.referenceText,
        data.concept,
      ]);
      return rows[0].register_bank_transfer;
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async voidTransfer(
    transferId: string,
    businessDate: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    try {
      await this.manager.query('SELECT void_bank_transfer($1, $2, $3, $4)', [
        transferId,
        businessDate,
        userId,
        reason,
      ]);
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async adjustBalance(
    data: AdjustBankBalanceData,
  ): Promise<BankAccountMovement> {
    let movementId: string;
    try {
      const rows = await this.manager.query<{ adjust_bank_balance: string }[]>(
        'SELECT adjust_bank_balance($1, $2, $3, $4, $5, $6)',
        [
          data.bankId,
          data.newBalance,
          data.businessDate,
          data.userId,
          data.reason,
          data.observation,
        ],
      );
      movementId = rows[0].adjust_bank_balance;
    } catch (error) {
      throw this.translateError(error);
    }

    const rows = await this.manager.query<MovementRow[]>(
      `${MOVEMENT_SELECT} WHERE m.id = $1`,
      [movementId],
    );
    if (rows.length === 0) {
      throw new InternalServerErrorException(
        'No se pudo recuperar el ajuste recién registrado.',
      );
    }
    return this.toMovement(rows[0]);
  }

  async registerBalanceCredit(
    data: RegisterBankBalanceCreditData,
  ): Promise<BankBalanceCreditResult> {
    let operationId: string;
    let movementId: string;
    try {
      const rows = await this.manager.query<
        { out_operation_id: string; out_movement_id: string }[]
      >(
        'SELECT out_operation_id, out_movement_id FROM register_bank_balance_credit($1, $2, $3, $4, $5, $6)',
        [
          data.bankId,
          data.amount,
          data.businessDate,
          data.userId,
          data.referenceText,
          data.observation,
        ],
      );
      operationId = rows[0].out_operation_id;
      movementId = rows[0].out_movement_id;
    } catch (error) {
      throw this.translateError(error);
    }

    const rows = await this.manager.query<MovementRow[]>(
      `${MOVEMENT_SELECT} WHERE m.id = $1`,
      [movementId],
    );
    if (rows.length === 0) {
      throw new InternalServerErrorException(
        'No se pudo recuperar la acreditación recién registrada.',
      );
    }
    return { operationId, movement: this.toMovement(rows[0]) };
  }

  async voidBalanceCredit(
    operationId: string,
    businessDate: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    try {
      await this.manager.query(
        'SELECT void_bank_balance_credit($1, $2, $3, $4)',
        [operationId, businessDate, userId, reason],
      );
    } catch (error) {
      throw this.translateError(error);
    }
  }

  async findMovements(
    filters: BankMovementFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedBankMovements> {
    const { where, params } = this.buildFilters(filters);
    const [{ total }] = await this.manager.query<{ total: string }[]>(
      `SELECT COUNT(*) AS total FROM bank_account_movements m ${where}`,
      params,
    );
    const rows = await this.manager.query<MovementRow[]>(
      `${MOVEMENT_SELECT} ${where}
       ORDER BY m.business_date DESC, m.sequence DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit],
    );
    return {
      items: rows.map((row) => this.toMovement(row)),
      total: parseInt(total, 10),
      page,
      limit,
    };
  }

  async findByReference(
    referenceType: string,
    referenceId: string,
  ): Promise<BankAccountMovement[]> {
    const rows = await this.manager.query<MovementRow[]>(
      `${MOVEMENT_SELECT} WHERE m.reference_type = $1 AND m.reference_id = $2 ORDER BY m.sequence`,
      [referenceType, referenceId],
    );
    return rows.map((row) => this.toMovement(row));
  }

  async findTransferById(transferId: string): Promise<BankTransfer | null> {
    const rows = await this.manager.query<TransferRow[]>(
      `${TRANSFER_SELECT} AND s.reference_id = $1`,
      [transferId],
    );
    return rows.length > 0 ? this.toTransfer(rows[0]) : null;
  }

  async getLastMovementByBank(): Promise<Map<string, LastBankMovement>> {
    // DISTINCT ON + ORDER BY sequence DESC: el movimiento más reciente por
    // cuenta, usando el índice (bank_id, sequence).
    const rows = await this.manager.query<
      { bank_id: string; amount: string; created_at: Date }[]
    >(
      `SELECT DISTINCT ON (bank_id) bank_id, amount, created_at
       FROM bank_account_movements
       WHERE movement_type <> 'SALDO_INICIAL'
       ORDER BY bank_id, sequence DESC`,
    );
    return new Map(
      rows.map((row) => [
        row.bank_id,
        { amount: parseFloat(row.amount), createdAt: row.created_at },
      ]),
    );
  }

  async findTransfers(
    filters: BankTransferFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedBankTransfers> {
    const { where, params } = this.buildTransferFilters(filters);
    const [{ total }] = await this.manager.query<{ total: string }[]>(
      `SELECT COUNT(*) AS total FROM (${TRANSFER_SELECT} ${where}) t`,
      params,
    );
    const rows = await this.manager.query<TransferRow[]>(
      `${TRANSFER_SELECT} ${where}
       ORDER BY s.sequence DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit],
    );
    return {
      items: rows.map((row) => this.toTransfer(row)),
      total: parseInt(total, 10),
      page,
      limit,
    };
  }

  async getTransfersSummary(
    filters: BankTransferFilters,
  ): Promise<BankTransfersSummary> {
    const { where, params } = this.buildTransferFilters(filters);
    const base = `(${TRANSFER_SELECT} ${where}) t`;
    const [totals] = await this.manager.query<
      {
        transfer_count: string;
        total_amount: string;
        voided_count: string;
        voided_amount: string;
      }[]
    >(
      `SELECT
         COUNT(*) FILTER (WHERE t.status = 'APLICADO') AS transfer_count,
         COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'APLICADO'), 0) AS total_amount,
         COUNT(*) FILTER (WHERE t.status = 'ANULADO') AS voided_count,
         COALESCE(SUM(t.amount) FILTER (WHERE t.status = 'ANULADO'), 0) AS voided_amount
       FROM ${base}`,
      params,
    );
    const routes = await this.manager.query<
      {
        source_bank_id: string;
        source_bank_name: string;
        source_account_number: string;
        destination_bank_id: string | null;
        destination_bank_name: string | null;
        destination_account_number: string | null;
        transfer_count: string;
        total_amount: string;
      }[]
    >(
      `SELECT
         t.source_bank_id, t.source_bank_name, t.source_account_number,
         t.destination_bank_id, t.destination_bank_name, t.destination_account_number,
         COUNT(*) AS transfer_count, SUM(t.amount) AS total_amount
       FROM ${base}
       WHERE t.status = 'APLICADO'
       GROUP BY t.source_bank_id, t.source_bank_name, t.source_account_number,
                t.destination_bank_id, t.destination_bank_name, t.destination_account_number
       ORDER BY SUM(t.amount) DESC`,
      params,
    );
    return {
      transferCount: parseInt(totals.transfer_count, 10),
      totalAmount: parseFloat(totals.total_amount),
      voidedCount: parseInt(totals.voided_count, 10),
      voidedAmount: parseFloat(totals.voided_amount),
      byRoute: routes.map((row) => ({
        sourceBankId: row.source_bank_id,
        sourceBankName: row.source_bank_name,
        sourceAccountNumber: row.source_account_number,
        destinationBankId: row.destination_bank_id,
        destinationBankName: row.destination_bank_name,
        destinationAccountNumber: row.destination_account_number,
        transferCount: parseInt(row.transfer_count, 10),
        totalAmount: parseFloat(row.total_amount),
      })),
    };
  }

  /** Condiciones sobre el par salida (`s`) / entrada (`e`) de `TRANSFER_SELECT` — se anexan con AND a su WHERE. */
  private buildTransferFilters(filters: BankTransferFilters): {
    where: string;
    params: unknown[];
  } {
    const conditions: string[] = [];
    const params: unknown[] = [];
    const add = (condition: string, value: unknown) => {
      params.push(value);
      conditions.push(condition.replace(/\?/g, `$${params.length}`));
    };
    if (filters.startDate) add('s.business_date >= ?', filters.startDate);
    if (filters.endDate) add('s.business_date <= ?', filters.endDate);
    if (filters.bankId) add('(s.bank_id = ? OR e.bank_id = ?)', filters.bankId);
    if (filters.sourceBankId) add('s.bank_id = ?', filters.sourceBankId);
    if (filters.destinationBankId)
      add('e.bank_id = ?', filters.destinationBankId);
    if (filters.userId) add('s.user_id = ?', filters.userId);
    if (filters.status) add('s.status = ?', filters.status);
    if (filters.kind) {
      add(
        's.movement_type = ?',
        filters.kind === 'CASH_WITHDRAWAL'
          ? 'RETIRO_EFECTIVO'
          : 'TRANSFERENCIA_SALIDA',
      );
    }
    return {
      where: conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private buildFilters(filters: BankMovementFilters): {
    where: string;
    params: unknown[];
  } {
    const conditions: string[] = [];
    const params: unknown[] = [];
    const add = (condition: string, value: unknown) => {
      params.push(value);
      conditions.push(condition.replace('?', `$${params.length}`));
    };
    if (filters.startDate) add('m.business_date >= ?', filters.startDate);
    if (filters.endDate) add('m.business_date <= ?', filters.endDate);
    if (filters.bankId) add('m.bank_id = ?', filters.bankId);
    if (filters.movementType) add('m.movement_type = ?', filters.movementType);
    if (filters.userId) add('m.user_id = ?', filters.userId);
    return {
      where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
    };
  }

  private toMovement(row: MovementRow): BankAccountMovement {
    return {
      id: row.id,
      sequence: parseInt(row.sequence, 10),
      bankId: row.bank_id,
      bankName: row.bank_name,
      accountNumber: row.account_number,
      accountTypeName: row.account_type_name,
      movementType: row.movement_type,
      origin: row.origin,
      amount: parseFloat(row.amount),
      balanceBefore: parseFloat(row.balance_before),
      balanceAfter: parseFloat(row.balance_after),
      businessDate: row.business_date,
      createdAt: row.created_at,
      userId: row.user_id,
      username: row.username ?? '',
      referenceType: row.reference_type,
      referenceId: row.reference_id,
      referenceText: row.reference_text,
      concept: row.concept,
      observation: row.observation,
      counterpartBankId: row.counterpart_bank_id,
      counterpartBankName: row.counterpart_bank_name,
      counterpartAccountNumber: row.counterpart_account_number,
      status: row.status,
      reversalOfId: row.reversal_of_id,
      reversedAt: row.reversed_at,
      reversedByUsername: row.reversed_by_username,
    };
  }

  private toTransfer(row: TransferRow): BankTransfer {
    return {
      id: row.id,
      kind: row.kind,
      businessDate: row.business_date,
      createdAt: row.created_at,
      amount: parseFloat(row.amount),
      userId: row.user_id,
      username: row.username ?? '',
      referenceText: row.reference_text,
      concept: row.concept,
      status: row.status,
      source: {
        bankId: row.source_bank_id,
        bankName: row.source_bank_name,
        accountNumber: row.source_account_number,
        balanceBefore: parseFloat(row.source_balance_before),
        balanceAfter: parseFloat(row.source_balance_after),
      },
      destination:
        row.destination_bank_id !== null
          ? {
              bankId: row.destination_bank_id,
              bankName: row.destination_bank_name ?? '',
              accountNumber: row.destination_account_number ?? '',
              balanceBefore: parseFloat(row.destination_balance_before ?? '0'),
              balanceAfter: parseFloat(row.destination_balance_after ?? '0'),
            }
          : null,
    };
  }

  /** Mismo patrón `RAISE EXCEPTION '<CODE>:<detalle>'` → error de dominio que el resto de repositorios; el detalle técnico nunca llega al usuario. */
  private translateError(error: unknown): unknown {
    if (!(error instanceof QueryFailedError)) {
      return error;
    }
    const message =
      (error.driverError as { message?: string } | undefined)?.message ??
      error.message;

    const businessError = bankMovementErrorFromMessage(message);
    if (businessError) {
      return businessError;
    }

    const [code, detail] = message.split(':');
    switch (code) {
      case 'BANK_NOT_FOUND':
        return new BankNotFoundError(detail);
      case 'BANK_INACTIVE':
        return new BankInactiveError(detail);
      case 'TRANSFER_NOT_FOUND':
        return new BankTransferNotFoundError(detail);
      default:
        return error;
    }
  }
}
