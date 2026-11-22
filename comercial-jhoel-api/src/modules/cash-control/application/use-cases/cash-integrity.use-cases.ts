import { Inject, Injectable } from '@nestjs/common';
import {
  INTEGRITY_CLASSIFICATIONS,
  classifySource,
  differenceChanges,
  relateFindings,
  sortFindings,
  summarize,
  type IntegrityClassification,
  type IntegrityFinding,
  type IntegritySummary,
  type TimelineCount,
} from '../../domain/cash-integrity';
import {
  CASH_INTEGRITY_REPOSITORY,
  type CashIntegrityRepository,
  type IntegrityScope,
  type OpeningStatus,
} from '../../domain/repositories/cash-integrity.repository';
import {
  CASH_STATEMENT_REPOSITORY,
  type CashStatementRepository,
  type CashStatementRowPage,
} from '../../domain/repositories/cash-statement.repository';
import type { CashStatementPeriod } from '../../domain/cash-statement';
import { assertCashCustodyPermission } from '../../domain/policies/cash-control.policy';
import { cashControlError } from '../../domain/errors/cash-control.errors';

export interface CashIntegrityActor {
  userId: string;
  role: string;
}

/** Same-type, same-amount, same-description movements by the same user within this many minutes. */
export const POSSIBLE_DUPLICATE_MINUTES = 10;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const money = (value: number): string =>
  `${value < 0 ? '-' : ''}Q${Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const TYPE_LABEL: Record<string, string> = {
  ENTRADA_MANUAL: 'Entrada manual',
  SALIDA_MANUAL: 'Salida manual',
  SALDO_INICIAL: 'Saldo inicial',
  GASTO_POR_COBRAR: 'Gasto por cobrar',
  ABONO_POR_COBRAR: 'Abono por cobrar',
  ACTIVO: 'Activo',
  DEVOLUCION_ACTIVO: 'Devolución de activo',
  RETIRO_BANCARIO: 'Retiro bancario hacia caja',
  DEPOSITO_BANCARIO: 'Depósito bancario',
  ENTREGA_BODEGA: 'Entrega a Bodega',
  DEVOLUCION_BODEGA: 'Devolución de Bodega',
  ANULACION: 'Anulación',
};

export interface CashIntegrityReport {
  period: Pick<
    CashStatementPeriod,
    | 'kind'
    | 'businessDate'
    | 'dateFrom'
    | 'dateTo'
    | 'windowStart'
    | 'windowEnd'
    | 'isCurrent'
  > & { afterSequence: number; upToSequence: number | null };
  summary: IntegritySummary;
  /** Arqueo de apertura of the bank day (null for a date range or when no bank day is open). */
  opening: OpeningStatus | null;
  /** Every physical count of the period in order, with the change of its difference. */
  timeline: {
    caja: TimelineCount[];
    bodega: TimelineCount[];
    previousCaja: TimelineCount | null;
    previousBodega: TimelineCount | null;
  };
  findings: IntegrityFinding[];
  checkedAt: Date;
}

/**
 * "Auditoría de efectivo": verifies, for a bank day (default: the current
 * one) or a date range, that the Caja Kardex is consistent with itself, with
 * every operation that must (or must not) move cash, with the figures other
 * modules stored and with the physical counts — and locates in which stretch
 * of movements each count difference appeared. Read-only and descriptive:
 * facts, users, dates and amounts; never a correction, never an accusation.
 * Supervisors and admins (`cash_custody.view`, owner decision).
 */
@Injectable()
export class GetCashIntegrityUseCase {
  constructor(
    @Inject(CASH_INTEGRITY_REPOSITORY)
    private readonly repository: CashIntegrityRepository,
    @Inject(CASH_STATEMENT_REPOSITORY)
    private readonly statements: CashStatementRepository,
  ) {}

  async execute(
    actor: CashIntegrityActor,
    query: { bankDate?: string; dateFrom?: string; dateTo?: string },
  ): Promise<CashIntegrityReport> {
    assertCashCustodyPermission(actor.role, 'cash_custody.view');
    for (const value of [query.bankDate, query.dateFrom, query.dateTo]) {
      if (value !== undefined && !DATE.test(value)) {
        throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
      }
    }
    if (query.bankDate && (query.dateFrom || query.dateTo)) {
      throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
    }
    if (query.dateFrom && query.dateTo && query.dateFrom > query.dateTo) {
      throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
    }
    const period = await this.statements.resolvePeriod({
      location: 'CAJA',
      bankDate: query.bankDate,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });
    if (!period) {
      throw cashControlError('CASH_STATEMENT_DAY_NOT_FOUND');
    }
    const scope: IntegrityScope = {
      afterSequence: period.startSequence,
      upToSequence: period.endSequence,
      windowStart: period.windowStart,
      windowEnd: period.windowEnd,
    };

    const [
      chain,
      signs,
      sources,
      duplicates,
      snapshots,
      caja,
      bodega,
      opening,
    ] = await Promise.all([
      this.repository.findChainBreaks(scope),
      this.repository.findSignViolations(scope),
      this.repository.findSourceComparisons(scope),
      this.repository.findPossibleDuplicates(scope, POSSIBLE_DUPLICATE_MINUTES),
      this.repository.findSnapshotMismatches(scope),
      this.repository.findCajaTimeline(scope),
      this.repository.findBodegaTimeline(scope),
      period.dayOpeningId
        ? this.repository.getOpeningStatus(period.dayOpeningId)
        : Promise.resolve(null),
    ]);

    const findings: Array<Omit<IntegrityFinding, 'relatedKeys'>> = [];

    for (const row of chain) {
      findings.push({
        key: `KARDEX_CHAIN:${row.id}`,
        check: 'KARDEX_CHAIN',
        severity: 'ALTA',
        classification: 'ERROR_CALCULO',
        title: 'Saldo anterior que no continúa el Kardex',
        detail:
          `El movimiento #${row.sequence} (${TYPE_LABEL[row.movementType] ?? row.movementType}) parte de ${money(row.previousBalance)}, ` +
          `pero el movimiento anterior terminó en ${money(row.expectedPrevious)} (diferencia ${money(row.previousBalance - row.expectedPrevious)}).`,
        amount: row.previousBalance - row.expectedPrevious,
        occurredAt: row.createdAt,
        username: row.username,
        movementIds: [row.id],
        reference: null,
        window: null,
        count: null,
      });
    }

    for (const row of signs) {
      const type = TYPE_LABEL[row.movementType] ?? row.movementType;
      findings.push(
        row.kind === 'SIGN'
          ? {
              key: `SIGN_RULE:${row.id}`,
              check: 'SIGN_RULE',
              severity: 'ALTA',
              classification: 'ERROR_REGISTRO',
              title: 'Entrada o salida al revés',
              detail: `${type} de ${money(row.amount)} se registró como ${row.direction === 'IN' ? 'entrada' : 'salida'}; ese tipo siempre es ${row.expectedDirection === 'IN' ? 'entrada' : 'salida'}. ${row.description}`,
              amount: row.amount,
              occurredAt: row.createdAt,
              username: row.username,
              movementIds: [row.id],
              reference: null,
              window: null,
              count: null,
            }
          : {
              key: `REVERSAL:${row.id}`,
              check: 'REVERSAL',
              severity: 'ALTA',
              classification:
                row.kind === 'REVERSAL_MISSING'
                  ? 'MOVIMIENTO_OMITIDO'
                  : 'ERROR_REGISTRO',
              title:
                row.kind === 'REVERSAL_MISSING'
                  ? 'Anulado sin su reversa'
                  : 'Anulación que no refleja al original',
              detail:
                row.kind === 'REVERSAL_MISSING'
                  ? `${type} de ${money(row.amount)} está marcado como anulado, pero no tiene el movimiento de anulación: su efecto nunca se revirtió en Caja. ${row.description}`
                  : `La anulación #${row.sequence} de ${money(row.amount)} no coincide con el movimiento que anula (monto, sentido o estado). ${row.description}`,
              amount: row.amount,
              occurredAt: row.createdAt,
              username: row.username,
              movementIds: [row.id],
              reference: null,
              window: null,
              count: null,
            },
      );
    }

    for (const source of sources) {
      const finding = classifySource(source);
      if (finding) {
        findings.push({ ...finding, window: null, count: null });
      }
    }

    for (const pair of duplicates) {
      findings.push({
        key: `POSSIBLE_DUPLICATE:${pair.firstId}:${pair.secondId}`,
        check: 'POSSIBLE_DUPLICATE',
        severity: 'MEDIA',
        classification: 'MOVIMIENTO_DUPLICADO',
        title: 'Posible movimiento duplicado (verificar)',
        detail:
          `${pair.username} registró dos veces "${pair.description}" por ${money(pair.amount)} ` +
          `(${pair.direction === 'IN' ? 'entrada' : 'salida'}) con menos de ${POSSIBLE_DUPLICATE_MINUTES} minutos de diferencia. ` +
          'Pueden ser dos operaciones reales: confirme con el comprobante antes de corregir.',
        amount: pair.direction === 'IN' ? pair.amount : -pair.amount,
        occurredAt: pair.secondAt,
        username: pair.username,
        movementIds: [pair.firstId, pair.secondId],
        reference: null,
        window: null,
        count: null,
      });
    }

    for (const snapshot of snapshots) {
      findings.push({
        key: `SNAPSHOT:${snapshot.key}`,
        check: 'SNAPSHOT',
        severity: snapshot.historical ? 'BAJA' : 'ALTA',
        classification: snapshot.historical
          ? 'INCONSISTENCIA_HISTORICA'
          : 'ERROR_CALCULO',
        title: 'Saldo guardado que no coincide con el Kardex',
        detail:
          `${snapshot.label}: se guardó ${money(snapshot.stored)} y el Kardex indica ${money(snapshot.kardex)} ` +
          `(diferencia ${money(snapshot.stored - snapshot.kardex)}).` +
          (snapshot.historical
            ? ' El registro fue reconstruido al instalar los indicadores diarios.'
            : ''),
        amount: snapshot.stored - snapshot.kardex,
        occurredAt: snapshot.occurredAt,
        username: snapshot.username,
        movementIds: [],
        reference: null,
        window: null,
        count: null,
      });
    }

    findings.push(...differenceChanges('CAJA', caja.previous, caja.counts));
    findings.push(
      ...differenceChanges('BODEGA', bodega.previous, bodega.counts),
    );

    const sequences = await this.repository.findSequences([
      ...new Set(findings.flatMap((finding) => finding.movementIds)),
    ]);
    const related = sortFindings(
      relateFindings(findings, (id) => sequences.get(id)),
    );

    return {
      period: {
        kind: period.kind,
        businessDate: period.businessDate,
        dateFrom: period.dateFrom,
        dateTo: period.dateTo,
        windowStart: period.windowStart,
        windowEnd: period.windowEnd,
        isCurrent: period.isCurrent,
        afterSequence: period.startSequence,
        upToSequence: period.endSequence,
      },
      summary: summarize(related),
      opening,
      timeline: {
        caja: caja.counts,
        bodega: bodega.counts,
        previousCaja: caja.previous,
        previousBodega: bodega.previous,
      },
      findings: related,
      checkedAt: new Date(),
    };
  }
}

/**
 * "Investigar": the Kardex movements of a window (afterSequence, upToSequence]
 * of Caja or Bodega, in order, with users and running balances — where a
 * difference appeared. Up to 500 movements.
 */
@Injectable()
export class ListIntegrityMovementsUseCase {
  constructor(
    @Inject(CASH_STATEMENT_REPOSITORY)
    private readonly statements: CashStatementRepository,
  ) {}

  async execute(
    actor: CashIntegrityActor,
    query: {
      location?: 'CAJA' | 'BODEGA';
      afterSequence: number;
      upToSequence: number;
    },
  ): Promise<CashStatementRowPage> {
    assertCashCustodyPermission(actor.role, 'cash_custody.view');
    if (query.upToSequence < query.afterSequence) {
      throw cashControlError('CASH_STATEMENT_INVALID_RANGE');
    }
    const period: CashStatementPeriod = {
      kind: 'RANGE',
      location: query.location ?? 'CAJA',
      businessDate: null,
      dayOpeningId: null,
      dateFrom: '',
      dateTo: '',
      windowStart: new Date(0),
      windowEnd: null,
      startSequence: query.afterSequence,
      endSequence: query.upToSequence,
      isCurrent: false,
      agentDayStatus: null,
      openedByUsername: null,
      anchorOpeningBalance: null,
      anchorSource: null,
    };
    return this.statements.findRows(period, {}, 1, 500);
  }
}

/** The arqueo de apertura of the current bank day (or that it is still pending). */
@Injectable()
export class GetOpeningStatusUseCase {
  constructor(
    @Inject(CASH_INTEGRITY_REPOSITORY)
    private readonly repository: CashIntegrityRepository,
  ) {}

  async execute(actor: CashIntegrityActor): Promise<OpeningStatus | null> {
    assertCashCustodyPermission(actor.role, 'cash_custody.view');
    return this.repository.getOpeningStatus();
  }
}

/**
 * Arqueo de apertura (supervisors and admins, owner decision): counts the cash
 * at the start of the bank day and reconciles it with the official closing of
 * the previous day. A difference requires reason and responsible. It is
 * evidence only: it never changes the previous day nor blocks operations.
 */
@Injectable()
export class RegisterOpeningCountUseCase {
  constructor(
    @Inject(CASH_INTEGRITY_REPOSITORY)
    private readonly repository: CashIntegrityRepository,
  ) {}

  async execute(
    actor: CashIntegrityActor,
    input: {
      details: Array<{ denomination: number; quantity: number }>;
      observations?: string;
      reason?: string;
      responsible?: string;
      clientRequestId: string;
    },
  ): Promise<OpeningStatus | null> {
    assertCashCustodyPermission(actor.role, 'cash_custody.operate');
    if (!input.details?.length) {
      throw cashControlError('CASH_BREAKDOWN_REQUIRED');
    }
    await this.repository.registerOpeningCount({
      details: input.details,
      observations: input.observations?.trim() || null,
      reason: input.reason?.trim() || null,
      responsible: input.responsible?.trim() || null,
      userId: actor.userId,
      idempotencyKey: input.clientRequestId,
    });
    return this.repository.getOpeningStatus();
  }
}

/**
 * Closes an arqueo difference with a documented cause and explanation
 * (admins, owner decision), optionally registering in the same step the
 * authorized adjustment to the Caja Kardex for exactly the counted
 * difference. The difference stays visible as "resuelta".
 */
@Injectable()
export class ResolveCountDifferenceUseCase {
  constructor(
    @Inject(CASH_INTEGRITY_REPOSITORY)
    private readonly repository: CashIntegrityRepository,
  ) {}

  async execute(
    actor: CashIntegrityActor,
    input: {
      source: 'ARQUEO_CAJA' | 'CORTE' | 'ARQUEO_BODEGA';
      countId: string;
      cause: IntegrityClassification;
      explanation: string;
      withAdjustment?: boolean;
      clientRequestId: string;
    },
  ): Promise<{ id: string }> {
    assertCashCustodyPermission(actor.role, 'cash_custody.authorize');
    if (!INTEGRITY_CLASSIFICATIONS.includes(input.cause)) {
      throw cashControlError('CASH_RESOLUTION_INVALID_CAUSE');
    }
    if ((input.explanation ?? '').trim().length < 10) {
      throw cashControlError('CASH_RESOLUTION_EXPLANATION_REQUIRED');
    }
    if (input.withAdjustment && input.source === 'ARQUEO_BODEGA') {
      throw cashControlError('CASH_RESOLUTION_ADJUSTMENT_NOT_AVAILABLE');
    }
    const id = await this.repository.resolveDifference({
      source: input.source,
      countId: input.countId,
      cause: input.cause,
      explanation: input.explanation.trim(),
      withAdjustment: input.withAdjustment ?? false,
      userId: actor.userId,
      idempotencyKey: `RES:${input.clientRequestId}`,
    });
    return { id };
  }
}
