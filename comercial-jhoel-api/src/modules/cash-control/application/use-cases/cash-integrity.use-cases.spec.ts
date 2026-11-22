import {
  GetCashIntegrityUseCase,
  ListIntegrityMovementsUseCase,
  RegisterOpeningCountUseCase,
  ResolveCountDifferenceUseCase,
} from './cash-integrity.use-cases';
import type { CashIntegrityRepository } from '../../domain/repositories/cash-integrity.repository';
import type { CashStatementRepository } from '../../domain/repositories/cash-statement.repository';
import type { CashStatementPeriod } from '../../domain/cash-statement';

const SUPERVISOR = { userId: 'u-sup', role: 'SUPERVISOR_DE_TURNO' };
const ADMIN = { userId: 'u-admin', role: 'ADMIN' };
const CASHIER = { userId: 'u-user', role: 'USER' };

const PERIOD: CashStatementPeriod = {
  kind: 'BANK_DAY',
  location: 'CAJA',
  businessDate: '2099-07-02',
  dayOpeningId: 'day-2',
  dateFrom: '2099-07-02',
  dateTo: '2099-07-02',
  windowStart: new Date('2099-07-02T14:00:00Z'),
  windowEnd: null,
  startSequence: 10,
  endSequence: null,
  isCurrent: true,
  agentDayStatus: 'ABIERTO',
  openedByUsername: 'admin',
  anchorOpeningBalance: 6500,
  anchorSource: 'APERTURA',
};

function repos() {
  const integrity: jest.Mocked<CashIntegrityRepository> = {
    findChainBreaks: jest.fn().mockResolvedValue([]),
    findSignViolations: jest.fn().mockResolvedValue([]),
    findSourceComparisons: jest.fn().mockResolvedValue([
      {
        referenceType: 'BANK_DEPOSIT',
        referenceId: 'op-1',
        label: 'Retiros de Q100.00',
        occurredAt: new Date('2099-07-02T15:00:00Z'),
        username: 'cajero',
        expectedNet: -100,
        kardexNet: 100,
        rows: 1,
        activeRows: 1,
        expectsRow: true,
        movementIds: ['m-inverted'],
        rule: 'Retiros sale de Caja',
      },
    ]),
    findPossibleDuplicates: jest.fn().mockResolvedValue([]),
    findSnapshotMismatches: jest.fn().mockResolvedValue([]),
    findCajaTimeline: jest.fn().mockResolvedValue({
      previous: null,
      counts: [
        {
          source: 'ARQUEO_CAJA',
          id: 'c-b',
          label: 'Arqueo de Caja #2',
          countedAt: new Date('2099-07-02T18:00:00Z'),
          sequence: 20,
          theoretical: 7075,
          counted: 6925,
          difference: -150,
          username: 'supervisor',
          isOpening: false,
          resolution: null,
        },
      ],
    }),
    findBodegaTimeline: jest
      .fn()
      .mockResolvedValue({ previous: null, counts: [] }),
    findSequences: jest.fn().mockResolvedValue(new Map([['m-inverted', 15]])),
    getOpeningStatus: jest.fn().mockResolvedValue(null),
    registerOpeningCount: jest.fn().mockResolvedValue('count-1'),
    resolveDifference: jest.fn().mockResolvedValue('res-1'),
  };
  const statements = {
    resolvePeriod: jest.fn().mockResolvedValue(PERIOD),
    findRows: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 500,
      filteredIn: 0,
      filteredOut: 0,
    }),
  } as unknown as jest.Mocked<CashStatementRepository>;
  return { integrity, statements };
}

describe('Auditoría de efectivo — casos de uso', () => {
  it('builds the report: findings sorted, related to the count window, summary', async () => {
    const { integrity, statements } = repos();
    const report = await new GetCashIntegrityUseCase(
      integrity,
      statements,
    ).execute(SUPERVISOR, {});
    expect(report.summary).toMatchObject({
      status: 'ALERTA',
      unresolvedDifferences: 1,
    });
    const change = report.findings.find(
      (f) => f.check === 'DIFFERENCE_CHANGE',
    )!;
    expect(change.relatedKeys).toEqual(['SOURCE_SIGN:BANK_DEPOSIT:op-1']);
    expect(integrity.findPossibleDuplicates).toHaveBeenCalledWith(
      {
        afterSequence: 10,
        upToSequence: null,
        windowStart: PERIOD.windowStart,
        windowEnd: null,
      },
      10,
    );
    expect(integrity.getOpeningStatus).toHaveBeenCalledWith('day-2');
  });

  it('is for supervisors and admins only, and validates the period', async () => {
    const { integrity, statements } = repos();
    const useCase = new GetCashIntegrityUseCase(integrity, statements);
    await expect(useCase.execute(CASHIER, {})).rejects.toMatchObject({
      code: 'CASH_CUSTODY_FORBIDDEN',
    });
    await expect(
      useCase.execute(ADMIN, { dateFrom: '2099-07-03', dateTo: '2099-07-02' }),
    ).rejects.toMatchObject({
      code: 'CASH_STATEMENT_INVALID_RANGE',
    });
    statements.resolvePeriod.mockResolvedValueOnce(null);
    await expect(
      useCase.execute(ADMIN, { bankDate: '2099-12-31' }),
    ).rejects.toMatchObject({
      code: 'CASH_STATEMENT_DAY_NOT_FOUND',
    });
    await expect(
      new ListIntegrityMovementsUseCase(statements).execute(CASHIER, {
        afterSequence: 1,
        upToSequence: 2,
      }),
    ).rejects.toMatchObject({ code: 'CASH_CUSTODY_FORBIDDEN' });
  });

  it('the opening count: supervisors count it; the key is per form opening', async () => {
    const { integrity } = repos();
    const useCase = new RegisterOpeningCountUseCase(integrity);
    await expect(
      useCase.execute(CASHIER, {
        details: [{ denomination: 100, quantity: 1 }],
        clientRequestId: 'k',
      }),
    ).rejects.toMatchObject({ code: 'CASH_CUSTODY_FORBIDDEN' });
    await useCase.execute(SUPERVISOR, {
      details: [{ denomination: 100, quantity: 1 }],
      reason: '  Faltan Q50  ',
      responsible: ' Supervisor ',
      clientRequestId: 'k-1',
    });
    expect(integrity.registerOpeningCount).toHaveBeenCalledWith({
      details: [{ denomination: 100, quantity: 1 }],
      observations: null,
      reason: 'Faltan Q50',
      responsible: 'Supervisor',
      userId: 'u-sup',
      idempotencyKey: 'k-1',
    });
  });

  it('a resolution needs an admin, a valid cause and an explanation; Bodega has no adjustment', async () => {
    const { integrity } = repos();
    const useCase = new ResolveCountDifferenceUseCase(integrity);
    const input = {
      source: 'ARQUEO_CAJA' as const,
      countId: 'c-b',
      cause: 'ERROR_REGISTRO' as const,
      explanation: 'Retiro registrado como entrada',
      withAdjustment: true,
      clientRequestId: 'r-1',
    };
    await expect(useCase.execute(SUPERVISOR, input)).rejects.toMatchObject({
      code: 'CASH_CUSTODY_FORBIDDEN',
    });
    await expect(
      useCase.execute(ADMIN, { ...input, explanation: 'corta' }),
    ).rejects.toMatchObject({
      code: 'CASH_RESOLUTION_EXPLANATION_REQUIRED',
    });
    await expect(
      useCase.execute(ADMIN, { ...input, cause: 'FRAUDE' as never }),
    ).rejects.toMatchObject({ code: 'CASH_RESOLUTION_INVALID_CAUSE' });
    await expect(
      useCase.execute(ADMIN, { ...input, source: 'ARQUEO_BODEGA' }),
    ).rejects.toMatchObject({
      code: 'CASH_RESOLUTION_ADJUSTMENT_NOT_AVAILABLE',
    });
    await expect(useCase.execute(ADMIN, input)).resolves.toEqual({
      id: 'res-1',
    });
    expect(integrity.resolveDifference).toHaveBeenCalledWith(
      expect.objectContaining({
        withAdjustment: true,
        userId: 'u-admin',
        idempotencyKey: 'RES:r-1',
      }),
    );
  });
});
