import type {
  CorrectionRow,
  FinancialDayRawData,
  FinancialDayReviewRepository,
  ReviewSessionRow,
} from '../../domain/repositories/financial-day-review.repository';
import { FinancialDayReviewError } from '../../domain/errors/financial-day-review.errors';
import { hasFinancialDayPermission } from '../../domain/financial-day-permissions';
import {
  AdjustFinancialDayMovementUseCase,
  CloseFinancialDayReviewUseCase,
  CorrectFinancialDaySnapshotUseCase,
  GetFinancialDayReviewUseCase,
  ListFinancialDaysUseCase,
  OpenFinancialDayReviewUseCase,
  RequestFinancialDayReviewCloseUseCase,
} from './financial-day-review.use-cases';

const SUPER = { userId: 'u-super', role: 'SUPER_ADMIN' };
const ADMIN = { userId: 'u-admin', role: 'ADMIN' };
const USER = { userId: 'u-user', role: 'USER' };

const emptyDay: FinancialDayRawData = {
  date: '2026-10-15',
  agentDay: null,
  banks: [],
  bankMovements: [],
  transactions: [],
  cashDay: null,
  cuts: [],
  cashMovements: [],
  receivables: { clients: [], rows: [], lateRows: [] },
  assets: { clients: [], rows: [], lateRows: [] },
  reconciliation: null,
  adjustments: [],
  adjacentMovements: [],
};

const session: ReviewSessionRow = {
  id: 's1',
  reviewDate: '2026-10-15',
  status: 'IN_REVIEW',
  reason: 'Descuadre',
  openedById: SUPER.userId,
  openedByUsername: 'super',
  openedAt: new Date(),
  closeRequestedAt: null,
  closedByUsername: null,
  closedAt: null,
  closeObservations: null,
  correctionsCount: 2,
  hasPendingDifferences: null,
  differenceBefore: 50,
  differenceAfter: null,
  snapshotBefore: {},
  snapshotAfter: null,
};

function correction(
  id: string,
  module: CorrectionRow['module'],
  targetId = id,
): CorrectionRow {
  return {
    id,
    sessionId: 's1',
    reviewDate: '2026-10-15',
    module,
    correctionType: 'SNAPSHOT_VERSION',
    targetTable: 'bank_balances',
    targetId,
    field: 'final_balance',
    originalValue: 120000,
    newValue: 125000,
    difference: 5000,
    reason: 'Saldo mal digitado',
    observations: null,
    originalReference: null,
    createdByUsername: 'super',
    createdAt: new Date(),
  };
}

function repository(): jest.Mocked<FinancialDayReviewRepository> {
  return {
    listDays: jest.fn().mockResolvedValue([]),
    getDayData: jest.fn().mockResolvedValue(emptyDay),
    openSession: jest.fn().mockResolvedValue('s1'),
    correctSnapshot: jest.fn().mockResolvedValue('k1'),
    adjustMovement: jest.fn().mockResolvedValue('k2'),
    requestClose: jest.fn().mockResolvedValue(undefined),
    closeSession: jest.fn().mockResolvedValue(undefined),
    findSessionById: jest.fn().mockResolvedValue(session),
    findActiveSession: jest.fn().mockResolvedValue(session),
    listSessions: jest.fn().mockResolvedValue([session]),
    listCorrections: jest
      .fn()
      .mockResolvedValue([
        correction('k1', 'BANCOS'),
        correction('k2', 'CUENTAS_POR_COBRAR'),
      ]),
  };
}

async function expectCode(promise: Promise<unknown>, code: string) {
  await expect(promise).rejects.toBeInstanceOf(FinancialDayReviewError);
  await promise.catch((error: FinancialDayReviewError) =>
    expect(error.code).toBe(code),
  );
}

describe('financial-day-review use cases', () => {
  it('permission map: review = SUPER_ADMIN/ADMIN, correct = SUPER_ADMIN', () => {
    expect(hasFinancialDayPermission('ADMIN', 'financial_days.review')).toBe(
      true,
    );
    expect(hasFinancialDayPermission('ADMIN', 'financial_days.correct')).toBe(
      false,
    );
    expect(
      hasFinancialDayPermission('SUPER_ADMIN', 'financial_days.correct'),
    ).toBe(true);
    expect(hasFinancialDayPermission('USER', 'financial_days.review')).toBe(
      false,
    );
    expect(
      hasFinancialDayPermission('SUPERVISOR_DE_TURNO', 'financial_days.review'),
    ).toBe(false);
  });

  it('list: USER is rejected and the range is validated', async () => {
    const repo = repository();
    const useCase = new ListFinancialDaysUseCase(repo);
    await expectCode(
      useCase.execute({
        from: '2026-10-01',
        to: '2026-10-31',
        role: USER.role,
      }),
      'FINANCIAL_REVIEW_FORBIDDEN',
    );
    await expectCode(
      useCase.execute({
        from: '2026-10-31',
        to: '2026-10-01',
        role: ADMIN.role,
      }),
      'FINANCIAL_REVIEW_INVALID_DATE',
    );
    await useCase.execute({
      from: '2026-10-01',
      to: '2026-10-31',
      role: ADMIN.role,
    });
    expect(repo.listDays).toHaveBeenCalledWith('2026-10-01', '2026-10-31');
  });

  it('detail: ADMIN can read but not correct; the owner is flagged', async () => {
    const repo = repository();
    const useCase = new GetFinancialDayReviewUseCase(repo);
    const asAdmin = await useCase.execute({ date: '2026-10-15', ...ADMIN });
    expect(asAdmin.permissions).toEqual({
      canReview: true,
      canCorrect: false,
      isSessionOwner: false,
    });
    const asSuper = await useCase.execute({ date: '2026-10-15', ...SUPER });
    expect(asSuper.permissions.isSessionOwner).toBe(true);
    expect(asSuper.activeSession?.id).toBe('s1');
  });

  it('open: ADMIN rejected, reason required, the "before" photograph builder is passed to the transaction', async () => {
    const repo = repository();
    const useCase = new OpenFinancialDayReviewUseCase(repo);
    await expectCode(
      useCase.execute({ date: '2026-10-15', reason: 'Descuadre', ...ADMIN }),
      'FINANCIAL_REVIEW_FORBIDDEN',
    );
    await expectCode(
      useCase.execute({ date: '2026-10-15', reason: ' ab ', ...SUPER }),
      'FINANCIAL_REVIEW_REASON_REQUIRED',
    );
    await expectCode(
      useCase.execute({ date: '15/10/2026', reason: 'Descuadre', ...SUPER }),
      'FINANCIAL_REVIEW_INVALID_DATE',
    );
    await useCase.execute({
      date: '2026-10-15',
      reason: '  Descuadre en agentes ',
      ...SUPER,
    });
    const [, userId, reason, builder] = repo.openSession.mock.calls[0];
    expect(userId).toBe(SUPER.userId);
    expect(reason).toBe('Descuadre en agentes');
    expect(builder(emptyDay).hasPendingDifferences).toBe(false);
  });

  it('snapshot correction: only whitelisted targets/fields reach the database', async () => {
    const repo = repository();
    const useCase = new CorrectFinancialDaySnapshotUseCase(repo);
    const base = {
      sessionId: 's1',
      targetId: 't',
      newValue: 1,
      reason: 'Motivo válido',
      requestId: 'req-12345',
    };
    await expectCode(
      useCase.execute({
        ...base,
        target: 'BANKS',
        field: 'final_balance',
        ...SUPER,
      }),
      'FINANCIAL_REVIEW_INVALID_TARGET',
    );
    await expectCode(
      useCase.execute({
        ...base,
        target: 'BANK_BALANCE',
        field: 'bank_id',
        ...SUPER,
      }),
      'FINANCIAL_REVIEW_INVALID_FIELD',
    );
    await expectCode(
      useCase.execute({
        ...base,
        target: 'BANK_BALANCE',
        field: 'final_balance',
        ...ADMIN,
      }),
      'FINANCIAL_REVIEW_FORBIDDEN',
    );
    expect(repo.correctSnapshot).not.toHaveBeenCalled();
    const result = await useCase.execute({
      ...base,
      target: 'BANK_BALANCE',
      field: 'final_balance',
      ...SUPER,
    });
    expect(result.id).toBe('k1');
  });

  it('movement adjustment: unknown sources are rejected', async () => {
    const repo = repository();
    const useCase = new AdjustFinancialDayMovementUseCase(repo);
    const base = {
      sessionId: 's1',
      sourceId: 'x',
      correctedAmount: 10,
      reason: 'Motivo válido',
      requestId: 'req-12345',
    };
    await expectCode(
      useCase.execute({ ...base, source: 'SALES', ...SUPER }),
      'FINANCIAL_REVIEW_INVALID_TARGET',
    );
    const result = await useCase.execute({
      ...base,
      source: 'ACCOUNT_RECEIVABLE',
      ...SUPER,
    });
    expect(result.id).toBe('k2');
  });

  it('close request: summary counts corrections by module and compares before/after', async () => {
    const repo = repository();
    const summary = await new RequestFinancialDayReviewCloseUseCase(
      repo,
    ).execute({ sessionId: 's1', ...SUPER });
    expect(repo.requestClose).toHaveBeenCalledWith('s1', SUPER.userId);
    expect(summary.totalCorrections).toBe(2);
    expect(summary.banksModified).toBe(1);
    expect(summary.receivableCorrections).toBe(1);
    expect(summary.differenceBefore).toBe(50);
    expect(summary.differenceAfter).toBe(0);
    expect(summary.hasPendingDifferences).toBe(false);
  });

  it('close: passes the explicit acceptance and the "after" photograph builder', async () => {
    const repo = repository();
    await new CloseFinancialDayReviewUseCase(repo).execute({
      sessionId: 's1',
      acceptPendingDifferences: true,
      observations: 'ok',
      ...SUPER,
    });
    const [input, builder] = repo.closeSession.mock.calls[0];
    expect(input).toEqual({
      sessionId: 's1',
      userId: SUPER.userId,
      observations: 'ok',
      acceptPendingDifferences: true,
    });
    expect(typeof builder).toBe('function');
    await expectCode(
      new CloseFinancialDayReviewUseCase(repo).execute({
        sessionId: 's1',
        acceptPendingDifferences: false,
        ...ADMIN,
      }),
      'FINANCIAL_REVIEW_FORBIDDEN',
    );
  });
});
