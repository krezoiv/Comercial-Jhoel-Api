import { Inject, Injectable } from '@nestjs/common';
import {
  CorrectionRow,
  FINANCIAL_DAY_REVIEW_REPOSITORY,
  MOVEMENT_SOURCES,
  MovementSource,
  ReviewSessionRow,
  SNAPSHOT_TARGETS,
  SnapshotTarget,
} from '../../domain/repositories/financial-day-review.repository';
import type {
  FinancialDayListRow,
  FinancialDayReviewRepository,
} from '../../domain/repositories/financial-day-review.repository';
import {
  FINANCIAL_DAY_PERMISSIONS,
  FinancialDayPermission,
  hasFinancialDayPermission,
} from '../../domain/financial-day-permissions';
import { financialDayReviewError } from '../../domain/errors/financial-day-review.errors';
import {
  FinancialDayDiagnosis,
  diagnoseFinancialDay,
  photographOf,
} from '../../domain/services/financial-day-diagnostics';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function assertPermission(
  role: string | undefined,
  permission: FinancialDayPermission,
): void {
  if (!hasFinancialDayPermission(role, permission)) {
    throw financialDayReviewError('FINANCIAL_REVIEW_FORBIDDEN');
  }
}

function assertDate(value: string): void {
  if (!ISO_DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw financialDayReviewError('FINANCIAL_REVIEW_INVALID_DATE');
  }
}

/** Who is asking (from the JWT), re-checked by every use case. */
export interface ReviewActor {
  userId: string;
  role: string;
}

export interface FinancialDayDetailOutput {
  date: string;
  diagnosis: FinancialDayDiagnosis;
  activeSession: ReviewSessionRow | null;
  sessions: ReviewSessionRow[];
  corrections: CorrectionRow[];
  permissions: {
    canReview: boolean;
    canCorrect: boolean;
    isSessionOwner: boolean;
  };
}

export interface CloseSummaryOutput {
  session: ReviewSessionRow;
  totalCorrections: number;
  byModule: Record<string, number>;
  banksModified: number;
  cashCorrections: number;
  receivableCorrections: number;
  assetCorrections: number;
  differenceBefore: number | null;
  differenceAfter: number;
  hasPendingDifferences: boolean;
  pendingDifferences: FinancialDayDiagnosis['differences'];
}

/** Calendar/table of operational days with cheap per-day indicators. */
@Injectable()
export class ListFinancialDaysUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(input: {
    from: string;
    to: string;
    role: string;
  }): Promise<FinancialDayListRow[]> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.review);
    assertDate(input.from);
    assertDate(input.to);
    const days = (Date.parse(input.to) - Date.parse(input.from)) / 86_400_000;
    if (days < 0 || days > 400) {
      throw financialDayReviewError('FINANCIAL_REVIEW_INVALID_DATE');
    }
    return this.repository.listDays(input.from, input.to);
  }
}

/** Everything about one day: full diagnosis, review sessions and audit trail. */
@Injectable()
export class GetFinancialDayReviewUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: { date: string } & ReviewActor,
  ): Promise<FinancialDayDetailOutput> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.review);
    assertDate(input.date);
    const [data, sessions, corrections] = await Promise.all([
      this.repository.getDayData(input.date),
      this.repository.listSessions(input.date),
      this.repository.listCorrections({ date: input.date }),
    ]);
    const activeSession = sessions.find((s) => s.status !== 'CLOSED') ?? null;
    return {
      date: input.date,
      diagnosis: diagnoseFinancialDay(data),
      activeSession,
      sessions,
      corrections,
      permissions: {
        canReview: true,
        canCorrect: hasFinancialDayPermission(
          input.role,
          FINANCIAL_DAY_PERMISSIONS.correct,
        ),
        isSessionOwner:
          !!activeSession && activeSession.openedById === input.userId,
      },
    };
  }
}

/** Opens a closed past day in review mode (creates the session; changes no data). */
@Injectable()
export class OpenFinancialDayReviewUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: { date: string; reason: string } & ReviewActor,
  ): Promise<ReviewSessionRow> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.correct);
    assertDate(input.date);
    if (!input.reason || input.reason.trim().length < 5) {
      throw financialDayReviewError('FINANCIAL_REVIEW_REASON_REQUIRED');
    }
    const id = await this.repository.openSession(
      input.date,
      input.userId,
      input.reason.trim(),
      photographOf,
    );
    const session = await this.repository.findSessionById(id);
    if (!session) {
      throw financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND');
    }
    return session;
  }
}

/** Corrects a day-owned snapshot value in place (versioned + audited). */
@Injectable()
export class CorrectFinancialDaySnapshotUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: {
      sessionId: string;
      target: string;
      targetId: string;
      field: string;
      newValue: number;
      reason: string;
      observations?: string | null;
      requestId: string;
    } & ReviewActor,
  ): Promise<CorrectionRow> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.correct);
    const fields = SNAPSHOT_TARGETS[input.target as SnapshotTarget] as
      readonly string[] | undefined;
    if (!fields) {
      throw financialDayReviewError('FINANCIAL_REVIEW_INVALID_TARGET');
    }
    if (!fields.includes(input.field)) {
      throw financialDayReviewError('FINANCIAL_REVIEW_INVALID_FIELD');
    }
    const id = await this.repository.correctSnapshot({
      sessionId: input.sessionId,
      target: input.target as SnapshotTarget,
      targetId: input.targetId,
      field: input.field,
      newValue: input.newValue,
      reason: input.reason,
      observations: input.observations,
      userId: input.userId,
      requestId: input.requestId,
    });
    return findCorrection(this.repository, input.sessionId, id);
  }
}

/** Corrects a ledger movement through a linked adjustment (the ledger is never edited). */
@Injectable()
export class AdjustFinancialDayMovementUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: {
      sessionId: string;
      source: string;
      sourceId: string;
      correctedAmount: number;
      reason: string;
      observations?: string | null;
      requestId: string;
    } & ReviewActor,
  ): Promise<CorrectionRow> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.correct);
    if (!(MOVEMENT_SOURCES as readonly string[]).includes(input.source)) {
      throw financialDayReviewError('FINANCIAL_REVIEW_INVALID_TARGET');
    }
    const id = await this.repository.adjustMovement({
      sessionId: input.sessionId,
      source: input.source as MovementSource,
      sourceId: input.sourceId,
      correctedAmount: input.correctedAmount,
      reason: input.reason,
      observations: input.observations,
      userId: input.userId,
      requestId: input.requestId,
    });
    return findCorrection(this.repository, input.sessionId, id);
  }
}

async function findCorrection(
  repository: FinancialDayReviewRepository,
  sessionId: string,
  id: string,
): Promise<CorrectionRow> {
  const corrections = await repository.listCorrections({ sessionId });
  const correction = corrections.find((c) => c.id === id);
  if (!correction) {
    throw financialDayReviewError('FINANCIAL_REVIEW_TARGET_NOT_FOUND');
  }
  return correction;
}

/** Builds the close summary from the session's audit trail and the day's current diagnosis. */
function buildCloseSummary(
  session: ReviewSessionRow,
  corrections: CorrectionRow[],
  diagnosis: FinancialDayDiagnosis,
): CloseSummaryOutput {
  const byModule: Record<string, number> = {};
  for (const correction of corrections) {
    byModule[correction.module] = (byModule[correction.module] ?? 0) + 1;
  }
  const count = (modules: string[]) =>
    corrections.filter((c) => modules.includes(c.module)).length;
  return {
    session,
    totalCorrections: corrections.length,
    byModule,
    banksModified: new Set(
      corrections
        .filter((c) => c.module === 'BANCOS' || c.module === 'TRANSACCIONES')
        .map((c) => c.targetId),
    ).size,
    cashCorrections: count(['EFECTIVO', 'CORTES']),
    receivableCorrections: count(['CUENTAS_POR_COBRAR']),
    assetCorrections: count(['ACTIVOS']),
    differenceBefore: session.differenceBefore,
    differenceAfter: diagnosis.totalAbsoluteDifference,
    hasPendingDifferences: diagnosis.hasPendingDifferences,
    pendingDifferences: diagnosis.differences,
  };
}

/** Moves the session to PENDING_CONFIRMATION and returns the close summary. */
@Injectable()
export class RequestFinancialDayReviewCloseUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: { sessionId: string } & ReviewActor,
  ): Promise<CloseSummaryOutput> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.correct);
    await this.repository.requestClose(input.sessionId, input.userId);
    const session = await this.repository.findSessionById(input.sessionId);
    if (!session) {
      throw financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND');
    }
    const [corrections, data] = await Promise.all([
      this.repository.listCorrections({ sessionId: session.id }),
      this.repository.getDayData(session.reviewDate),
    ]);
    return buildCloseSummary(session, corrections, diagnoseFinancialDay(data));
  }
}

/** Closes the review (stores the corrected photograph; other days untouched). */
@Injectable()
export class CloseFinancialDayReviewUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(
    input: {
      sessionId: string;
      observations?: string | null;
      acceptPendingDifferences: boolean;
    } & ReviewActor,
  ): Promise<ReviewSessionRow> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.correct);
    await this.repository.closeSession(
      {
        sessionId: input.sessionId,
        userId: input.userId,
        observations: input.observations,
        acceptPendingDifferences: input.acceptPendingDifferences,
      },
      photographOf,
    );
    const session = await this.repository.findSessionById(input.sessionId);
    if (!session) {
      throw financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND');
    }
    return session;
  }
}

/** Audit trail of corrections (by day or by session). */
@Injectable()
export class ListFinancialDayCorrectionsUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(input: {
    date?: string;
    sessionId?: string;
    role: string;
  }): Promise<CorrectionRow[]> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.review);
    if (input.date) {
      assertDate(input.date);
    }
    return this.repository.listCorrections({
      date: input.date,
      sessionId: input.sessionId,
    });
  }
}

/** One session with its stored before/after photographs. */
@Injectable()
export class GetFinancialDayReviewSessionUseCase {
  constructor(
    @Inject(FINANCIAL_DAY_REVIEW_REPOSITORY)
    private readonly repository: FinancialDayReviewRepository,
  ) {}

  async execute(input: {
    sessionId: string;
    role: string;
  }): Promise<ReviewSessionRow> {
    assertPermission(input.role, FINANCIAL_DAY_PERMISSIONS.review);
    const session = await this.repository.findSessionById(input.sessionId);
    if (!session) {
      throw financialDayReviewError('FINANCIAL_REVIEW_SESSION_NOT_FOUND');
    }
    return session;
  }
}
