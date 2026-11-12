import {
  CloseAgentDayUseCase,
  assertCuadreCashBreakdown,
} from './close-agent-day.use-case';
import type { CuadreCashBreakdownData } from '../../domain/repositories/agent-reconciliation.repository';

const ACCEPTANCE: Array<[number, number]> = [
  [200, 10],
  [100, 20],
  [50, 10],
  [20, 10],
  [10, 10],
  [5, 10],
  [1, 20],
  [0.5, 10],
  [0.25, 20],
  [0.1, 10],
  [0.05, 10],
  [0.01, 100],
];

function breakdown(
  overrides: Partial<CuadreCashBreakdownData> = {},
): CuadreCashBreakdownData {
  return {
    source: 'MANUAL',
    sourceCashCountId: null,
    details: ACCEPTANCE.map(([denomination, quantity]) => ({
      denomination,
      quantity,
    })),
    ...overrides,
  };
}

function code(fn: () => void): string | undefined {
  try {
    fn();
  } catch (error) {
    return (error as { code?: string }).code;
  }
  return undefined;
}

describe('assertCuadreCashBreakdown', () => {
  it('accepts the acceptance scenario (Q4,882.50, 100 × Q0.01)', () => {
    expect(
      code(() => assertCuadreCashBreakdown(4882.5, breakdown(), 'USER')),
    ).toBeUndefined();
  });

  it('rejects a total that does not match the breakdown (backend recomputes, never trusts the client)', () => {
    expect(
      code(() => assertCuadreCashBreakdown(4883, breakdown(), 'USER')),
    ).toBe('CUADRE_CASH_BREAKDOWN_MISMATCH');
  });

  it.each([
    ['unknown denomination', { denomination: 0.02, quantity: 1 }],
    ['fractional quantity', { denomination: 1, quantity: 1.5 }],
    ['negative quantity', { denomination: 1, quantity: -1 }],
    ['duplicated denomination', { denomination: 200, quantity: 0 }],
  ])('rejects %s', (_label, row) => {
    const data = breakdown();
    data.details.push(row);
    expect(code(() => assertCuadreCashBreakdown(4882.5, data, 'ADMIN'))).toBe(
      'CUADRE_CASH_BREAKDOWN_INVALID',
    );
  });

  it('CORTE_CAJA (one cut arqueo) needs its id and the same read role', () => {
    const fromCut = breakdown({
      source: 'CORTE_CAJA',
      sourceCashCountId: 'cut-count-2',
    });
    expect(
      code(() => assertCuadreCashBreakdown(4882.5, fromCut, 'ADMIN')),
    ).toBeUndefined();
    expect(code(() => assertCuadreCashBreakdown(4882.5, fromCut, 'USER'))).toBe(
      'CUADRE_SOURCE_COUNT_FORBIDDEN',
    );
    expect(
      code(() =>
        assertCuadreCashBreakdown(
          4882.5,
          breakdown({ source: 'CORTE_CAJA' }),
          'ADMIN',
        ),
      ),
    ).toBe('CUADRE_CASH_BREAKDOWN_INVALID');
  });

  it('ARQUEO_CAJA needs the source id and a role allowed to read arqueos; MANUAL must not carry one', () => {
    expect(
      code(() =>
        assertCuadreCashBreakdown(
          4882.5,
          breakdown({ source: 'ARQUEO_CAJA' }),
          'ADMIN',
        ),
      ),
    ).toBe('CUADRE_CASH_BREAKDOWN_INVALID');
    expect(
      code(() =>
        assertCuadreCashBreakdown(
          4882.5,
          breakdown({ sourceCashCountId: 'c1' }),
          'ADMIN',
        ),
      ),
    ).toBe('CUADRE_CASH_BREAKDOWN_INVALID');
    const fromCount = breakdown({
      source: 'ARQUEO_CAJA',
      sourceCashCountId: 'c1',
    });
    expect(
      code(() => assertCuadreCashBreakdown(4882.5, fromCount, 'USER')),
    ).toBe('CUADRE_SOURCE_COUNT_FORBIDDEN');
    expect(
      code(() =>
        assertCuadreCashBreakdown(4882.5, fromCount, 'SUPERVISOR_DE_TURNO'),
      ),
    ).toBeUndefined();
  });
});

describe('CloseAgentDayUseCase with a cash breakdown', () => {
  function build() {
    const repository = {
      closeDayWithReconciliation: jest.fn().mockResolvedValue({
        id: 'r1',
        date: '2026-11-11',
        totalCash: 4882.5,
        totalWarehouseCash: 0,
        totalBanks: 0,
        totalAssets: 0,
        totalAccountsReceivable: 0,
        result: 4882.5,
        createdAt: new Date(),
        createdByUsername: 'admin',
      }),
      existsForDate: jest.fn(),
      findLatestByDate: jest.fn(),
    };
    const dayOpenings = {
      findByDate: jest.fn().mockResolvedValue({ isClosed: false }),
    };
    const summary = {
      execute: jest.fn().mockResolvedValue({
        totalWarehouseCash: 1000,
        totalBanks: 2000,
        totalAccountsReceivable: 300,
        totalAssets: 100,
      }),
    };
    const balances = {
      execute: jest.fn().mockResolvedValue({ canReconcile: true }),
    };
    const useCase = new CloseAgentDayUseCase(
      repository as never,
      dayOpenings as never,
      summary as never,
      balances as never,
    );
    return { useCase, repository };
  }

  it('passes the exact breakdown used to the repository (photograph source)', async () => {
    const { useCase, repository } = build();
    const data = breakdown({ source: 'ARQUEO_CAJA', sourceCashCountId: 'c1' });
    data.details[11].quantity = 150; // modified after loading the arqueo
    await useCase.execute({
      totalCash: 4883,
      date: '2026-11-11',
      userId: 'u1',
      role: 'ADMIN',
      cashBreakdown: data,
    });
    const call = repository.closeDayWithReconciliation.mock.calls[0][0];
    expect(call.cashBreakdown).toEqual(data);
    expect(call.totalCash).toBe(4883);
    expect(call.result).toBe(4883 + 1000 + 2000 + 300 - 100);
  });

  it('rejects before touching the database when the breakdown does not add up', async () => {
    const { useCase, repository } = build();
    await expect(
      useCase.execute({
        totalCash: 1,
        date: '2026-11-11',
        userId: 'u1',
        role: 'ADMIN',
        cashBreakdown: breakdown(),
      }),
    ).rejects.toMatchObject({
      code: 'CUADRE_CASH_BREAKDOWN_MISMATCH',
      status: 400,
    });
    expect(repository.closeDayWithReconciliation).not.toHaveBeenCalled();
  });

  it('keeps the original path when no breakdown is sent', async () => {
    const { useCase, repository } = build();
    await useCase.execute({ totalCash: 10, date: '2026-11-11', userId: 'u1' });
    expect(
      repository.closeDayWithReconciliation.mock.calls[0][0].cashBreakdown,
    ).toBeNull();
  });
});
