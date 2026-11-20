import {
  CloseAgentDayUseCase,
  assertCuadreCashBreakdown,
  assertCuadreWarehouseBreakdown,
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

describe('assertCuadreWarehouseBreakdown (physical Bodega count)', () => {
  const code = (fn: () => unknown): string | undefined => {
    try {
      fn();
      return undefined;
    } catch (error) {
      return (error as { code?: string }).code;
    }
  };

  it('returns the exact total in centavos', () => {
    expect(
      assertCuadreWarehouseBreakdown([
        { denomination: 200, quantity: 4 },
        { denomination: 0.1, quantity: 3 },
        { denomination: 0.01, quantity: 7 },
      ]),
    ).toBe(800.37);
    expect(
      assertCuadreWarehouseBreakdown([{ denomination: 100, quantity: 0 }]),
    ).toBe(0);
  });

  it('rejects unknown denominations, fractions, negatives and duplicates', () => {
    for (const rows of [
      [{ denomination: 3, quantity: 1 }],
      [{ denomination: 100, quantity: 1.5 }],
      [{ denomination: 100, quantity: -1 }],
      [
        { denomination: 100, quantity: 1 },
        { denomination: 100, quantity: 2 },
      ],
    ]) {
      expect(code(() => assertCuadreWarehouseBreakdown(rows))).toBe(
        'CUADRE_WAREHOUSE_BREAKDOWN_INVALID',
      );
    }
  });
});

describe('CloseAgentDayUseCase with the Arqueo de Caja (caja + Bodega)', () => {
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
      findCashCount: jest.fn(),
    };
    const dayOpenings = {
      findByDate: jest.fn().mockResolvedValue({ isClosed: false }),
    };
    const summary = {
      execute: jest.fn().mockResolvedValue({
        // Theoretical Bodega: Q1,000. It must NOT enter the result anymore.
        totalWarehouseCash: 1000,
        totalSchoolListPending: 500,
        totalBanks: 2000,
        totalAccountsReceivable: 300,
        totalAssets: 100,
      }),
    };
    const balances = {
      execute: jest.fn().mockResolvedValue({ canReconcile: true }),
    };
    const useCase = new CloseAgentDayUseCase(
      repository,
      dayOpenings as never,
      summary as never,
      balances as never,
    );
    return { useCase, repository };
  }

  /** Bodega physically counted: Q900 (Q100 short against the Q1,000 theoretical). */
  const warehouse = () => [
    { denomination: 200, quantity: 4 },
    { denomination: 100, quantity: 1 },
  ];

  it('passes both counts to the repository and uses the COUNTED Bodega in the result', async () => {
    const { useCase, repository } = build();
    const data = breakdown({ source: 'ARQUEO_CAJA', sourceCashCountId: 'c1' });
    data.details[11].quantity = 150; // modified after loading the arqueo
    await useCase.execute({
      totalCash: 4883,
      date: '2026-11-11',
      userId: 'u1',
      role: 'ADMIN',
      cashBreakdown: data,
      warehouseDetails: warehouse(),
      observations: '  Conteo de cierre  ',
    });
    const call = repository.closeDayWithReconciliation.mock.calls[0][0];
    expect(call.cashBreakdown).toEqual(data);
    expect(call.warehouseDetails).toEqual(warehouse());
    expect(call.observations).toBe('Conteo de cierre');
    expect(call.totalCash).toBe(4883);
    expect(call.totalWarehouseCash).toBe(900);
    // School-list money still in banks (Q500) is subtracted and stored apart;
    // the Bodega shortage (Q100) shows in the result.
    expect(call.result).toBe(4883 + 900 + 2000 + 300 - 100 - 500);
    expect(call.totalSchoolListPending).toBe(500);
  });

  it('rejects before touching the database when the caja breakdown does not add up', async () => {
    const { useCase, repository } = build();
    await expect(
      useCase.execute({
        totalCash: 1,
        date: '2026-11-11',
        userId: 'u1',
        role: 'ADMIN',
        cashBreakdown: breakdown(),
        warehouseDetails: warehouse(),
      }),
    ).rejects.toMatchObject({
      code: 'CUADRE_CASH_BREAKDOWN_MISMATCH',
      status: 400,
    });
    expect(repository.closeDayWithReconciliation).not.toHaveBeenCalled();
  });

  it('requires the Arqueo de Caja: no caja count or no Bodega count is rejected', async () => {
    const { useCase, repository } = build();
    await expect(
      useCase.execute({ totalCash: 10, date: '2026-11-11', userId: 'u1' }),
    ).rejects.toMatchObject({
      code: 'CUADRE_CUSTODY_COUNT_REQUIRED',
      status: 400,
    });
    await expect(
      useCase.execute({
        totalCash: 4882.5,
        date: '2026-11-11',
        userId: 'u1',
        cashBreakdown: breakdown(),
      }),
    ).rejects.toMatchObject({ code: 'CUADRE_CUSTODY_COUNT_REQUIRED' });
    await expect(
      useCase.execute({
        totalCash: 4882.5,
        date: '2026-11-11',
        userId: 'u1',
        cashBreakdown: breakdown(),
        warehouseDetails: [{ denomination: 7, quantity: 1 }],
      }),
    ).rejects.toMatchObject({ code: 'CUADRE_WAREHOUSE_BREAKDOWN_INVALID' });
    expect(repository.closeDayWithReconciliation).not.toHaveBeenCalled();
  });

  it('an empty Bodega is counted as zero (all quantities 0)', async () => {
    const { useCase, repository } = build();
    await useCase.execute({
      totalCash: 4882.5,
      date: '2026-11-11',
      userId: 'u1',
      cashBreakdown: breakdown(),
      warehouseDetails: [{ denomination: 200, quantity: 0 }],
    });
    const call = repository.closeDayWithReconciliation.mock.calls[0][0];
    expect(call.totalWarehouseCash).toBe(0);
    expect(call.result).toBe(4882.5 + 0 + 2000 + 300 - 100 - 500);
  });
});
