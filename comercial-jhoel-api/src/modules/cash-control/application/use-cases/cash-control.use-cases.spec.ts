import {
  CashControlRepository,
  CashCutPeriodRow,
  CashMovementRow,
} from '../../domain/repositories/cash-control.repository';
import {
  CashControlRuleError,
  cashControlErrorFromMessage,
} from '../../domain/errors/cash-control.errors';
import {
  assertCutSchedule,
  guatemalaIsoDate,
  guatemalaTime,
  requireReason,
} from '../../domain/policies/cash-control.policy';
import { GetCashPositionUseCase } from './get-cash-position.use-case';
import {
  GetRecentCashMovementsUseCase,
  ListCashMovementsUseCase,
} from './cash-movement-queries.use-cases';
import {
  RegisterCashMovementUseCase,
  VoidCashMovementUseCase,
} from './cash-movement-commands.use-cases';
import {
  CloseCashDayUseCase,
  FinishCashCutUseCase,
  OpenCashDayUseCase,
  ReopenCashCutUseCase,
  StartCashCutUseCase,
  UpdateCashCutScheduleUseCase,
} from './cash-cut-commands.use-cases';

function movement(overrides: Partial<CashMovementRow> = {}): CashMovementRow {
  return {
    id: 'mov-1',
    sequence: 1,
    operationalDate: '2026-11-10',
    operationalDayId: null,
    cutPeriodId: null,
    cutPeriodNumber: null,
    movementType: 'DEPOSITO',
    originalMovementType: null,
    direction: 'IN',
    amount: 5000,
    previousBalance: 150000,
    newBalance: 155000,
    referenceType: 'BANK_DEPOSIT',
    referenceId: 'op-1',
    description: 'Depósito — 1 trans.',
    bankName: 'GTC',
    reason: null,
    reversalOfId: null,
    status: 'VIGENTE',
    voidedAt: null,
    voidedByUsername: null,
    voidReason: null,
    createdBy: 'user-1',
    createdByUsername: 'erick',
    createdAt: new Date('2026-11-10T14:15:00Z'),
    ...overrides,
  };
}

function period(overrides: Partial<CashCutPeriodRow> = {}): CashCutPeriodRow {
  return {
    id: 'p1',
    operationalDayId: 'day-1',
    operationalDate: '2026-11-10',
    periodNumber: 1,
    status: 'PROGRAMADO',
    // 07:00–13:00 in Guatemala (UTC−6).
    scheduledStartAt: new Date('2026-11-10T13:00:00Z'),
    scheduledEndAt: new Date('2026-11-10T19:00:00Z'),
    actualStartedAt: null,
    actualFinishedAt: null,
    startSequence: null,
    closingSequence: null,
    openingSystemCash: null,
    openingPhysicalCash: null,
    inheritedDifference: null,
    closingSystemCash: null,
    closingPhysicalCash: null,
    cashDifference: null,
    totalIn: null,
    totalOut: null,
    movementCount: null,
    openingBankBalances: null,
    openedByUsername: null,
    closedByUsername: null,
    observations: null,
    reopenedCount: 0,
    bankDifferenceTotal: null,
    bankReconciledCount: null,
    ...overrides,
  };
}

function repositoryMock(): jest.Mocked<CashControlRepository> {
  return {
    getBalance: jest.fn().mockResolvedValue({
      balance: 155000,
      lastSequence: 7,
      lastMovementAt: null,
    }),
    getDateSummary: jest.fn().mockResolvedValue({
      openingBalance: 150000,
      totalIn: 5000,
      totalOut: 0,
      movementCount: 1,
      buckets: [
        { movementType: 'DEPOSITO', totalIn: 5000, totalOut: 0, count: 1 },
      ],
    }),
    getRangeTotals: jest
      .fn()
      .mockResolvedValue({ totalIn: 5000, totalOut: 2000, movementCount: 2 }),
    hasInitialBalance: jest.fn().mockResolvedValue(true),
    findMovements: jest.fn(),
    findRecentMovements: jest.fn().mockResolvedValue([movement()]),
    findMovementById: jest.fn().mockResolvedValue(movement()),
    findMovementsByReference: jest.fn(),
    findUsers: jest.fn(),
    registerManualMovement: jest.fn().mockResolvedValue('mov-1'),
    voidManualMovement: jest.fn().mockResolvedValue('mov-2'),
    findDayByDate: jest.fn().mockResolvedValue(null),
    findDayById: jest.fn(),
    findPeriodsByDay: jest.fn().mockResolvedValue([]),
    findOpenPeriod: jest.fn().mockResolvedValue(null),
    findPeriodById: jest.fn().mockResolvedValue(period()),
    getBankBalances: jest.fn(),
    openDay: jest.fn().mockResolvedValue('day-1'),
    updateSchedule: jest.fn(),
    startPeriod: jest.fn(),
    finishPeriod: jest.fn(),
    reopenPeriod: jest.fn(),
    closeDay: jest.fn(),
    findDays: jest.fn(),
    findCutDetail: jest.fn(),
  };
}

async function expectRule(
  promise: Promise<unknown>,
  code: string,
): Promise<void> {
  await expect(promise).rejects.toBeInstanceOf(CashControlRuleError);
  await expect(promise).rejects.toMatchObject({ code });
}

describe('Control de Efectivo — policies', () => {
  it('uses America/Guatemala for the operational date (23 — time zone)', () => {
    // 2026-11-11 03:00 UTC is still 2026-11-10 21:00 in Guatemala.
    expect(guatemalaIsoDate(new Date('2026-11-11T03:00:00Z'))).toBe(
      '2026-11-10',
    );
    expect(guatemalaTime(new Date('2026-11-10T13:00:00Z'))).toBe('07:00');
  });

  it('rejects an end time before the start and overlapping cuts', () => {
    expect(() => assertCutSchedule(1, '13:00', '12:00')).toThrow(
      CashControlRuleError,
    );
    expect(() =>
      assertCutSchedule(1, '07:00', '14:00', { start: '13:00', end: '19:00' }),
    ).toThrow(expect.objectContaining({ code: 'CASH_CUT_SCHEDULE_OVERLAP' }));
    expect(() =>
      assertCutSchedule(2, '12:00', '19:00', { start: '07:00', end: '13:00' }),
    ).toThrow(expect.objectContaining({ code: 'CASH_CUT_SCHEDULE_OVERLAP' }));
    expect(() =>
      assertCutSchedule(1, '07:00', '13:00', { start: '13:00', end: '19:00' }),
    ).not.toThrow();
  });

  it('requires a reason of at least 5 characters', () => {
    expect(() => requireReason('  ')).toThrow(
      expect.objectContaining({ code: 'CASH_REASON_REQUIRED' }),
    );
    expect(requireReason('  Cambio de turno ')).toBe('Cambio de turno');
  });

  it('maps SQL RAISE codes to domain errors and ignores unknown messages', () => {
    expect(
      cashControlErrorFromMessage('CASH_CUT_FIRST_NOT_FINISHED')?.status,
    ).toBe(400);
    expect(cashControlErrorFromMessage('CASH_CUT_ANOTHER_OPEN')?.status).toBe(
      409,
    );
    expect(cashControlErrorFromMessage('duplicate key value')).toBeNull();
  });
});

describe('Control de Efectivo — queries', () => {
  it('position: official balance, day state and live totals of the open cut (10, 12)', async () => {
    const repository = repositoryMock();
    repository.findDayByDate.mockResolvedValue({
      id: 'day-1',
      status: 'ABIERTO',
      openingSystemCash: 150000,
    } as never);
    repository.findPeriodsByDay.mockResolvedValue([
      period({
        status: 'ABIERTO',
        startSequence: 5,
        actualStartedAt: new Date(),
      }),
      period({ id: 'p2', periodNumber: 2 }),
    ]);

    const position = await new GetCashPositionUseCase(repository).execute(
      '2026-11-10',
    );

    expect(position.balance).toBe(155000);
    expect(position.dayState).toBe('ABIERTO');
    expect(position.summary.openingBalance).toBe(150000);
    expect(position.openPeriod?.id).toBe('p1');
    expect(position.openPeriod?.liveSystemCash).toBe(155000);
    expect(position.openPeriod?.liveTotalOut).toBe(2000);
    expect(repository.getRangeTotals).toHaveBeenCalledWith(5, null);
    expect(position.canCloseDay).toBe(false);
  });

  it('position: day can be closed only when both cuts are FINALIZADO (20)', async () => {
    const repository = repositoryMock();
    repository.findDayByDate.mockResolvedValue({
      id: 'day-1',
      status: 'ABIERTO',
      openingSystemCash: 1,
    } as never);
    repository.findPeriodsByDay.mockResolvedValue([
      period({ status: 'FINALIZADO' }),
      period({ id: 'p2', periodNumber: 2, status: 'FINALIZADO' }),
    ]);
    expect(
      (await new GetCashPositionUseCase(repository).execute('2026-11-10'))
        .canCloseDay,
    ).toBe(true);
  });

  it('position without an opened day reports SIN_APERTURA', async () => {
    const position = await new GetCashPositionUseCase(repositoryMock()).execute(
      '2026-11-10',
    );
    expect(position.dayState).toBe('SIN_APERTURA');
    expect(position.periods).toEqual([]);
  });

  it('recent movements: last 10 by default, capped at 50 (11)', async () => {
    const repository = repositoryMock();
    const useCase = new GetRecentCashMovementsUseCase(repository);
    await useCase.execute();
    await useCase.execute(500);
    expect(repository.findRecentMovements).toHaveBeenNthCalledWith(1, 10);
    expect(repository.findRecentMovements).toHaveBeenNthCalledWith(2, 50);
  });

  it('Kardex: rejects an inverted date range and normalizes paging (12)', async () => {
    const repository = repositoryMock();
    const useCase = new ListCashMovementsUseCase(repository);
    await expectRule(
      useCase.execute({ dateFrom: '2026-11-10', dateTo: '2026-11-01' }),
      'CASH_INVALID_DATE_RANGE',
    );
    await useCase.execute({ direction: 'OUT', page: 0, limit: 1000 });
    expect(repository.findMovements).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'OUT', page: 1, limit: 200 }),
    );
  });
});

describe('Control de Efectivo — manual movements', () => {
  it('uses the client request id as idempotency key and returns the official balance (13)', async () => {
    const repository = repositoryMock();
    const result = await new RegisterCashMovementUseCase(repository).execute({
      movementType: 'ENTRADA_MANUAL',
      amount: 100.005,
      reason: 'Fondo de cambio',
      clientRequestId: '11111111-1111-1111-1111-111111111111',
      userId: 'user-1',
      role: 'SUPERVISOR_DE_TURNO',
    });
    expect(repository.registerManualMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        idempotencyKey: 'REQ:11111111-1111-1111-1111-111111111111',
        amount: 100.01,
      }),
    );
    expect(result.balance).toBe(155000);
  });

  it('only admins may register adjustments or the initial balance (21 — RBAC)', async () => {
    const useCase = new RegisterCashMovementUseCase(repositoryMock());
    for (const movementType of ['AJUSTE', 'SALDO_INICIAL'] as const) {
      await expectRule(
        useCase.execute({
          movementType,
          amount: 10,
          reason: 'Diferencia de arqueo',
          userId: 'u',
          role: 'SUPERVISOR_DE_TURNO',
        }),
        'CASH_FORBIDDEN',
      );
    }
  });

  it('rejects negative amounts except for adjustments, and a missing reason', async () => {
    const useCase = new RegisterCashMovementUseCase(repositoryMock());
    await expectRule(
      useCase.execute({
        movementType: 'SALIDA_MANUAL',
        amount: -5,
        reason: 'Pago de flete',
        userId: 'u',
        role: 'ADMIN',
      }),
      'CASH_INVALID_AMOUNT',
    );
    await expectRule(
      useCase.execute({
        movementType: 'AJUSTE',
        amount: -5,
        reason: '',
        userId: 'u',
        role: 'ADMIN',
      }),
      'CASH_REASON_REQUIRED',
    );
  });

  it('voiding is admin-only and returns the inverse movement (14)', async () => {
    const repository = repositoryMock();
    const useCase = new VoidCashMovementUseCase(repository);
    await expectRule(
      useCase.execute({
        id: 'mov-1',
        reason: 'Duplicado',
        userId: 'u',
        role: 'USER',
      }),
      'CASH_FORBIDDEN',
    );
    repository.findMovementById.mockResolvedValue(
      movement({ id: 'mov-2', movementType: 'ANULACION', direction: 'OUT' }),
    );
    const result = await useCase.execute({
      id: 'mov-1',
      reason: 'Duplicado',
      userId: 'u',
      role: 'ADMIN',
    });
    expect(repository.voidManualMovement).toHaveBeenCalledWith(
      'mov-1',
      'u',
      'Duplicado',
    );
    expect(result.movement.movementType).toBe('ANULACION');
  });
});

describe('Control de Efectivo — day and cuts', () => {
  let repository: jest.Mocked<CashControlRepository>;
  let position: GetCashPositionUseCase;

  beforeEach(() => {
    repository = repositoryMock();
    position = new GetCashPositionUseCase(repository);
  });

  it('opens today inheriting the cash (no manual amount sent) (1)', async () => {
    await new OpenCashDayUseCase(repository, position).execute({
      userId: 'u',
      role: 'SUPERVISOR_DE_TURNO',
    });
    expect(repository.openDay).toHaveBeenCalledWith(
      expect.objectContaining({
        date: guatemalaIsoDate(),
        manualPhysicalCash: null,
        reason: null,
        firstStart: null,
      }),
    );
  });

  it('only an admin may authorize a manual opening amount, with a reason', async () => {
    const useCase = new OpenCashDayUseCase(repository, position);
    await expectRule(
      useCase.execute({
        userId: 'u',
        role: 'SUPERVISOR_DE_TURNO',
        manualPhysicalCash: 1000,
        reason: 'Conteo inicial',
      }),
      'CASH_MANUAL_OPENING_FORBIDDEN',
    );
    await expectRule(
      useCase.execute({ userId: 'u', role: 'ADMIN', manualPhysicalCash: 1000 }),
      'CASH_REASON_REQUIRED',
    );
    await expectRule(
      useCase.execute({ userId: 'u', role: 'USER' }),
      'CASH_FORBIDDEN',
    );
  });

  it('validates a schedule sent with the opening', async () => {
    await expectRule(
      new OpenCashDayUseCase(repository, position).execute({
        userId: 'u',
        role: 'ADMIN',
        firstStart: '07:00',
        firstEnd: '14:00',
        secondStart: '13:00',
        secondEnd: '19:00',
      }),
      'CASH_CUT_SCHEDULE_OVERLAP',
    );
    expect(repository.openDay).not.toHaveBeenCalled();
  });

  it('schedule change validates against the sibling cut and requires a reason', async () => {
    repository.findPeriodsByDay.mockResolvedValue([
      period(),
      period({
        id: 'p2',
        periodNumber: 2,
        scheduledStartAt: new Date('2026-11-10T19:00:00Z'),
        scheduledEndAt: new Date('2026-11-11T01:00:00Z'),
      }),
    ]);
    const useCase = new UpdateCashCutScheduleUseCase(repository, position);
    await expectRule(
      useCase.execute({
        periodId: 'p1',
        start: '07:00',
        end: '13:30',
        reason: 'Turno largo',
        userId: 'u',
        role: 'ADMIN',
      }),
      'CASH_CUT_SCHEDULE_OVERLAP',
    );
    await useCase.execute({
      periodId: 'p1',
      start: '08:00',
      end: '12:30',
      reason: 'Turno corto',
      userId: 'u',
      role: 'ADMIN',
    });
    expect(repository.updateSchedule).toHaveBeenCalledWith(
      'p1',
      '08:00',
      '12:30',
      'Turno corto',
      'u',
    );
  });

  it('start/finish/close are restricted to cut managers (21 — RBAC)', async () => {
    await expectRule(
      new StartCashCutUseCase(repository, position).execute({
        periodId: 'p1',
        userId: 'u',
        role: 'USER',
      }),
      'CASH_FORBIDDEN',
    );
    await expectRule(
      new FinishCashCutUseCase(repository, position).execute({
        periodId: 'p1',
        userId: 'u',
        role: 'USER',
        details: [],
        banks: [],
      }),
      'CASH_FORBIDDEN',
    );
    await expectRule(
      new CloseCashDayUseCase(repository, position).execute({
        dayId: 'day-1',
        userId: 'u',
        role: 'USER',
      }),
      'CASH_FORBIDDEN',
    );
    await expectRule(
      new ReopenCashCutUseCase(repository, position).execute({
        periodId: 'p1',
        reason: 'Revisión',
        userId: 'u',
        role: 'SUPERVISOR_DE_TURNO',
      }),
      'CASH_FORBIDDEN',
    );
  });

  it('finish sends only counted denominations and normalized bank verifications (15, 19)', async () => {
    await new FinishCashCutUseCase(repository, position).execute({
      periodId: 'p1',
      userId: 'u',
      role: 'SUPERVISOR_DE_TURNO',
      details: [
        { denomination: 200, quantity: 3 },
        { denomination: 0.25, quantity: 0 },
      ],
      banks: [{ bankId: 'b1', verifiedBalance: 1000.004, observations: '  ' }],
      cashObservations: ' Faltan Q0.25 ',
    });
    expect(repository.finishPeriod).toHaveBeenCalledWith({
      periodId: 'p1',
      userId: 'u',
      details: [{ denomination: 200, quantity: 3 }],
      banks: [{ bankId: 'b1', verifiedBalance: 1000, observations: null }],
      cashObservations: 'Faltan Q0.25',
      observations: null,
    });
  });

  it('finish rejects a repeated denomination or a fractional quantity', async () => {
    const useCase = new FinishCashCutUseCase(repository, position);
    await expectRule(
      useCase.execute({
        periodId: 'p1',
        userId: 'u',
        role: 'ADMIN',
        details: [
          { denomination: 100, quantity: 1 },
          { denomination: 100, quantity: 2 },
        ],
        banks: [],
      }),
      'CASH_INVALID_DENOMINATION',
    );
    await expectRule(
      useCase.execute({
        periodId: 'p1',
        userId: 'u',
        role: 'ADMIN',
        details: [{ denomination: 5, quantity: 1.5 }],
        banks: [],
      }),
      'CASH_INVALID_DENOMINATION',
    );
  });

  it('unknown cut → 404', async () => {
    repository.findPeriodById.mockResolvedValue(null);
    await expectRule(
      new StartCashCutUseCase(repository, position).execute({
        periodId: 'x',
        userId: 'u',
        role: 'ADMIN',
      }),
      'CASH_CUT_NOT_FOUND',
    );
  });
});
