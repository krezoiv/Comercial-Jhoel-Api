import { Inject, Injectable } from '@nestjs/common';
import {
  CASH_COUNT_RESULT_LABEL,
  CASH_STATEMENT_TYPE_LABEL,
  buildCashStatementSummary,
  latestCount,
  type CashStatementCount,
  type CashStatementLocation,
  type CashStatementPeriod,
  type CashStatementSummary,
  type CashStatementWarning,
} from '../../domain/cash-statement';
import {
  CASH_STATEMENT_REPOSITORY,
  type CashStatementCut,
  type CashStatementDay,
  type CashStatementRepository,
  type CashStatementRowFilters,
  type CashStatementRowPage,
} from '../../domain/repositories/cash-statement.repository';
import {
  CASH_CUSTODY_PERMISSION_ROLES,
  assertCashCustodyPermission,
} from '../../domain/policies/cash-control.policy';
import { cashControlError } from '../../domain/errors/cash-control.errors';
import {
  CASH_INTEGRITY_REPOSITORY,
  type CashIntegrityRepository,
  type OpeningStatus,
} from '../../domain/repositories/cash-integrity.repository';
import { buildReportPdf } from '../../../reports/infrastructure/pdf/report-pdf.builder';
import { buildCashStatementExcel } from '../../infrastructure/export/cash-statement.excel';

export interface CashStatementActor {
  userId: string;
  username: string;
  role: string;
}

/** Period + table filters of a statement request. */
export interface CashStatementQuery extends CashStatementRowFilters {
  location?: CashStatementLocation;
  bankDate?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CashStatementPeriodOutput {
  kind: CashStatementPeriod['kind'];
  businessDate: string | null;
  dateFrom: string;
  dateTo: string;
  windowStart: Date;
  windowEnd: Date | null;
  isCurrent: boolean;
  agentDayStatus: CashStatementPeriod['agentDayStatus'];
  openedByUsername: string | null;
  anchorSource: CashStatementPeriod['anchorSource'];
}

/** Everything the "Estado de Cuenta de Efectivo" screen shows. */
export interface CashStatementOutput {
  location: CashStatementLocation;
  period: CashStatementPeriodOutput;
  summary: CashStatementSummary;
  warnings: CashStatementWarning[];
  movements: CashStatementRowPage;
  /** Physical counts of the period — `null` for users without `cash_custody.view`. */
  counts: CashStatementCount[] | null;
  /** Cuts of the period (Caja) — `null` without `cash_custody.view`. */
  cuts: CashStatementCut[] | null;
  /** Caja, Bodega and total under custody at the end of the period — `null` without `cash_custody.view`. */
  custody: { cash: number; warehouse: number; total: number } | null;
  canViewCustody: boolean;
  /** Arqueo de apertura of the bank day (Caja, custody viewers); `null` otherwise. */
  opening: OpeningStatus | null;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 366;
const PDF_ROW_LIMIT = 500;
const EXCEL_ROW_LIMIT = 5000;

export function canViewCashCustody(role: string | undefined): boolean {
  return (
    CASH_CUSTODY_PERMISSION_ROLES['cash_custody.view'] as readonly string[]
  ).includes(role ?? '');
}

function daysBetween(from: string, to: string): number {
  return (
    (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
    86_400_000
  );
}

/** Validates the period of a request (the DTO already checked the formats). */
function assertPeriod(query: CashStatementQuery): void {
  if (query.bankDate && (query.dateFrom || query.dateTo)) {
    throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
  }
  for (const value of [query.bankDate, query.dateFrom, query.dateTo]) {
    if (value !== undefined && !DATE.test(value)) {
      throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
    }
  }
  if (query.dateFrom && query.dateTo) {
    const days = daysBetween(query.dateFrom, query.dateTo);
    if (days < 0 || days > MAX_RANGE_DAYS) {
      throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
    }
  }
}

function periodOutput(period: CashStatementPeriod): CashStatementPeriodOutput {
  return {
    kind: period.kind,
    businessDate: period.businessDate,
    dateFrom: period.dateFrom,
    dateTo: period.dateTo,
    windowStart: period.windowStart,
    windowEnd: period.windowEnd,
    isCurrent: period.isCurrent,
    agentDayStatus: period.agentDayStatus,
    openedByUsername: period.openedByUsername,
    anchorSource: period.anchorSource,
  };
}

/**
 * Loads a statement: period, period totals, the requested page of movements,
 * and — only for `cash_custody.view` — counts, cuts and custody. Shared by the
 * screen and the exports so both always show the same figures.
 */
async function loadStatement(
  repository: CashStatementRepository,
  role: string,
  query: CashStatementQuery,
  page: number,
  limit: number,
  integrity: CashIntegrityRepository | null = null,
): Promise<CashStatementOutput> {
  const location = query.location ?? 'CAJA';
  const canViewCustody = canViewCashCustody(role);
  if (location === 'BODEGA') {
    assertCashCustodyPermission(role, 'cash_custody.view');
  }
  assertPeriod(query);
  const period = await repository.resolvePeriod({
    location,
    bankDate: query.bankDate,
    dateFrom: query.dateFrom,
    dateTo: query.dateTo,
  });
  if (!period) {
    throw cashControlError('CASH_STATEMENT_DAY_NOT_FOUND');
  }
  const filters: CashStatementRowFilters = {
    direction: query.direction,
    movementType: query.movementType,
    userId: query.userId,
    search: query.search?.trim() || undefined,
  };
  const [totals, movements, counts, previousCount, cuts, custody] =
    await Promise.all([
      repository.getTotals(period),
      repository.findRows(period, filters, page, limit),
      canViewCustody ? repository.findCounts(period) : Promise.resolve(null),
      canViewCustody
        ? repository.findPreviousCount(period)
        : Promise.resolve(null),
      canViewCustody ? repository.findCuts(period) : Promise.resolve(null),
      canViewCustody ? repository.getCustody(period) : Promise.resolve(null),
    ]);
  const latest = counts ? latestCount(counts) : null;
  const movementsAfterLatest = latest
    ? await repository.countMovementsAfter(period, latest.sequence)
    : 0;
  const { summary, warnings } = buildCashStatementSummary({
    period,
    totals,
    counts,
    movementsAfterLatest,
    previousCount,
  });
  // Arqueo de apertura of a Caja bank day: shown to custody viewers; a missing
  // one on the open day is a warning, never a block (owner decision).
  const opening =
    integrity && canViewCustody && location === 'CAJA' && period.dayOpeningId
      ? await integrity.getOpeningStatus(period.dayOpeningId)
      : null;
  if (opening && !opening.opening && period.isCurrent) {
    warnings.unshift({
      code: 'OPENING_PENDING',
      tone: 'warning',
      message: `Falta el arqueo de apertura: cuente el efectivo y compárelo con el cierre oficial de ayer (Q${opening.previousCloseBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}).`,
    });
  }
  return {
    location,
    period: periodOutput(period),
    summary,
    warnings,
    movements,
    counts,
    cuts,
    custody: custody
      ? {
          ...custody,
          total: Math.round((custody.cash + custody.warehouse) * 100) / 100,
        }
      : null,
    canViewCustody,
    opening,
  };
}

/**
 * "Estado de Cuenta de Efectivo": opening balance, entries, exits, theoretical
 * balance and the chronological physical movements with their running balance,
 * for a bank day (default: the current one) or a date range. Read-only over
 * the official Kardex. Everyone who can read the Kardex sees the movements;
 * counts, differences, Bodega and custody need `cash_custody.view` (owner
 * decision, 2026-11-21).
 */
@Injectable()
export class GetCashStatementUseCase {
  constructor(
    @Inject(CASH_STATEMENT_REPOSITORY)
    private readonly repository: CashStatementRepository,
    @Inject(CASH_INTEGRITY_REPOSITORY)
    private readonly integrity: CashIntegrityRepository,
  ) {}

  execute(
    actor: CashStatementActor,
    query: CashStatementQuery,
  ): Promise<CashStatementOutput> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(200, Math.max(1, query.limit ?? 50));
    return loadStatement(
      this.repository,
      actor.role,
      query,
      page,
      limit,
      this.integrity,
    );
  }
}

/** History of the Caja statement: one line per bank day (newest first). */
@Injectable()
export class ListCashStatementDaysUseCase {
  constructor(
    @Inject(CASH_STATEMENT_REPOSITORY)
    private readonly repository: CashStatementRepository,
  ) {}

  execute(
    actor: CashStatementActor,
    limit?: number,
  ): Promise<CashStatementDay[]> {
    return this.repository.findDays(
      Math.min(370, Math.max(1, limit ?? 30)),
      canViewCashCustody(actor.role),
    );
  }
}

export interface CashStatementFile {
  filename: string;
  contentType: string;
  buffer: Buffer;
}

const money = (value: number): string =>
  `${value < 0 ? '-' : ''}Q ${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const GT_DATE_TIME = new Intl.DateTimeFormat('es-GT', {
  timeZone: 'America/Guatemala',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const isoToDmy = (iso: string): string => iso.split('-').reverse().join('/');

export function cashStatementPeriodLabel(
  period: CashStatementPeriodOutput,
): string {
  if (period.kind === 'BANK_DAY' && period.businessDate) {
    return `Día bancario ${isoToDmy(period.businessDate)}${period.isCurrent ? ' (en curso)' : ''}`;
  }
  return period.dateFrom === period.dateTo
    ? isoToDmy(period.dateFrom)
    : `${isoToDmy(period.dateFrom)} – ${isoToDmy(period.dateTo)}`;
}

/**
 * PDF / Excel of the statement, built from exactly the same data as the screen
 * (same period, filters and permissions — no counts or Bodega for users who
 * may not see them).
 */
@Injectable()
export class ExportCashStatementUseCase {
  constructor(
    @Inject(CASH_STATEMENT_REPOSITORY)
    private readonly repository: CashStatementRepository,
  ) {}

  async execute(
    actor: CashStatementActor,
    query: CashStatementQuery,
    format: 'pdf' | 'xlsx',
  ): Promise<CashStatementFile> {
    const cap = format === 'pdf' ? PDF_ROW_LIMIT : EXCEL_ROW_LIMIT;
    const statement = await loadStatement(
      this.repository,
      actor.role,
      query,
      1,
      cap,
    );
    const { summary, movements } = statement;
    const place = statement.location === 'CAJA' ? 'Caja' : 'Bodega';
    const title = `Estado de Cuenta de Efectivo — ${place}`;
    const periodLabel = cashStatementPeriodLabel(statement.period);
    const physical = summary.physical;
    const count = physical?.count ?? null;
    const truncationNotice =
      movements.total > movements.items.length
        ? `Se muestran los primeros ${movements.items.length} de ${movements.total} movimientos${format === 'pdf' ? '; exporte a Excel para verlos todos' : ''}.`
        : undefined;
    const generatedAt = new Date();
    const base = `estado-cuenta-efectivo-${place.toLowerCase()}-${statement.period.businessDate ?? `${statement.period.dateFrom}_${statement.period.dateTo}`}`;

    const summaryLines: Array<{ label: string; value: number | string }> = [
      { label: 'Saldo inicial', value: summary.openingBalance },
      { label: 'Total de entradas', value: summary.totalIn },
      { label: 'Total de salidas', value: summary.totalOut },
      { label: 'Saldo teórico final', value: summary.theoreticalBalance },
      { label: 'Movimientos', value: String(summary.movementCount) },
    ];
    if (physical) {
      summaryLines.push(
        {
          label: 'Efectivo físico (último arqueo)',
          value: count ? count.counted : 'Sin arqueo',
        },
        {
          label: 'Diferencia',
          value: count ? count.difference : '—',
        },
        {
          label: 'Estado',
          value:
            CASH_COUNT_RESULT_LABEL[physical.status] +
            (count ? ` · ${count.number} · ${count.username}` : ''),
        },
      );
    }
    if (statement.custody) {
      summaryLines.push(
        { label: 'Caja', value: statement.custody.cash },
        { label: 'Bodega', value: statement.custody.warehouse },
        { label: 'Total bajo custodia', value: statement.custody.total },
      );
    }

    const lines = movements.items.map((row) => ({
      at: new Date(row.createdAt),
      operationNumber: row.operationNumber,
      type:
        (CASH_STATEMENT_TYPE_LABEL[row.movementType] ?? row.movementType) +
        (row.originalMovementType
          ? ` de ${CASH_STATEMENT_TYPE_LABEL[row.originalMovementType] ?? row.originalMovementType}`
          : ''),
      description: [row.description, row.beneficiary]
        .filter(Boolean)
        .join(' · '),
      reference: row.reference ?? '',
      user: row.username,
      entry: row.direction === 'IN' ? row.amount : null,
      exit: row.direction === 'OUT' ? row.amount : null,
      balance: row.newBalance,
      status: row.status === 'ANULADO' ? 'Anulado' : 'Vigente',
    }));

    if (format === 'xlsx') {
      return {
        filename: `${base}.xlsx`,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: await buildCashStatementExcel({
          title,
          periodLabel,
          generatedAt,
          generatedBy: actor.username,
          summary: summaryLines,
          openingBalance: summary.openingBalance,
          rows: lines,
          totalIn: summary.totalIn,
          totalOut: summary.totalOut,
          closingBalance: summary.theoreticalBalance,
          truncationNotice,
        }),
      };
    }

    const filters = [
      { label: 'Caja / Bodega', value: place },
      ...(query.direction
        ? [
            {
              label: 'Movimientos',
              value:
                query.direction === 'IN' ? 'Solo entradas' : 'Solo salidas',
            },
          ]
        : []),
      ...(query.movementType
        ? [
            {
              label: 'Tipo',
              value:
                CASH_STATEMENT_TYPE_LABEL[query.movementType] ??
                query.movementType,
            },
          ]
        : []),
      ...(query.search?.trim()
        ? [{ label: 'Búsqueda', value: query.search.trim() }]
        : []),
    ];
    const rows = [
      [
        '',
        '',
        'Saldo inicial',
        '',
        '',
        '',
        '',
        '',
        money(summary.openingBalance),
      ],
      ...lines.map((line) => [
        GT_DATE_TIME.format(line.at),
        line.operationNumber,
        line.type + (line.status === 'Anulado' ? ' (anulado)' : ''),
        line.description,
        line.reference,
        line.user,
        line.entry === null ? '' : money(line.entry),
        line.exit === null ? '' : money(line.exit),
        money(line.balance),
      ]),
      [
        '',
        '',
        'Totales del período',
        '',
        '',
        '',
        money(summary.totalIn),
        money(summary.totalOut),
        money(summary.theoreticalBalance),
      ],
    ];
    return {
      filename: `${base}.pdf`,
      contentType: 'application/pdf',
      buffer: await buildReportPdf({
        reportTitle: title,
        periodLabel,
        filters,
        summary: summaryLines.map((item) => ({
          label: item.label,
          value:
            typeof item.value === 'number' ? money(item.value) : item.value,
        })),
        columns: [
          { header: 'Fecha y hora', width: 78 },
          { header: 'No.', width: 62 },
          { header: 'Operación', width: 92, wrap: true },
          { header: 'Descripción / Beneficiario', width: 160, wrap: true },
          { header: 'Referencia', width: 70, wrap: true },
          { header: 'Usuario', width: 56 },
          { header: 'Entrada', width: 64, align: 'right' },
          { header: 'Salida', width: 64, align: 'right' },
          { header: 'Saldo', width: 70, align: 'right' },
        ],
        rows,
        generatedAt,
        generatedByUsername: actor.username,
        truncationNotice,
        layout: 'landscape',
      }),
    };
  }
}
