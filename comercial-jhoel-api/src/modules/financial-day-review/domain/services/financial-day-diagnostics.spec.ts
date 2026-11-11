import type { FinancialDayRawData } from '../repositories/financial-day-review.repository';
import {
  bankMovementCategory,
  diagnoseFinancialDay,
  explainDifference,
  maskAccountNumber,
  photographOf,
} from './financial-day-diagnostics';

const DAY = '2026-10-15';
const BANK = 'b1';
const CLIENT = 'c1';
const at = new Date('2026-10-15T15:00:00Z');

function emptyPortfolio() {
  return { clients: [], rows: [], lateRows: [] };
}

function baseDay(
  overrides: Partial<FinancialDayRawData> = {},
): FinancialDayRawData {
  return {
    date: DAY,
    agentDay: null,
    banks: [
      {
        bankId: BANK,
        name: 'Banco Industrial',
        accountNumber: '1234567890',
        specialAccount: null,
        accountTypeName: 'Monetaria',
        isActive: true,
        balanceRowId: 'bb1',
        previousBalance: 100000,
        finalBalance: 120000,
        previousDayDate: '2026-10-14',
        previousDayFinal: 100000,
        nextDayDate: '2026-10-16',
        nextDayPrevious: 120000,
        ledgerOpening: 100000,
        firstLedgerDate: '2026-09-26',
      },
    ],
    bankMovements: [
      {
        id: 'm1',
        sequence: 1,
        bankId: BANK,
        bankName: 'Banco Industrial',
        movementType: 'RETIRO',
        origin: 'TRANSACCIONAR',
        amount: 15000,
        balanceBefore: 100000,
        balanceAfter: 115000,
        status: 'APLICADO',
        referenceType: null,
        referenceId: null,
        referenceText: null,
        concept: 'Retiro',
        createdAt: at,
        username: 'admin',
      },
      {
        id: 'm2',
        sequence: 2,
        bankId: BANK,
        bankName: 'Banco Industrial',
        movementType: 'TRANSFERENCIA_ENTRADA',
        origin: 'TRANSFERENCIA',
        amount: 3000,
        balanceBefore: 115000,
        balanceAfter: 118000,
        status: 'APLICADO',
        referenceType: null,
        referenceId: null,
        referenceText: null,
        concept: 'Transferencia',
        createdAt: at,
        username: 'admin',
      },
    ],
    transactions: [],
    cashDay: null,
    cuts: [],
    cashMovements: [],
    receivables: emptyPortfolio(),
    assets: emptyPortfolio(),
    reconciliation: null,
    adjustments: [],
    adjacentMovements: [],
    ...overrides,
  };
}

describe('financial-day-diagnostics', () => {
  it('maps ledger types to the Agentes Bancarios columns', () => {
    expect(bankMovementCategory('DEPOSITO')).toBe('deposits');
    expect(bankMovementCategory('TRANSFERENCIA_SALIDA')).toBe('transfersOut');
    expect(bankMovementCategory('DESEMBOLSO_GENESIS')).toBe('disbursements');
    expect(bankMovementCategory('AJUSTE_MANUAL')).toBe('adjustments');
  });

  it('masks account numbers to the last four digits', () => {
    expect(maskAccountNumber('1234567890')).toBe('••••••7890');
    expect(maskAccountNumber('12')).toBe('12');
    expect(maskAccountNumber(null)).toBeNull();
  });

  it('bank: opening + movements vs registered closing, with the movements that explain it', () => {
    const diagnosis = diagnoseFinancialDay(baseDay());
    const [bank] = diagnosis.banks;
    expect(bank.theoreticalClosing).toBe(118000);
    expect(bank.registeredClosing).toBe(120000);
    expect(bank.difference).toBe(2000);
    expect(bank.totals.withdrawals).toBe(15000);
    expect(bank.totals.transfersIn).toBe(3000);
    expect(bank.maskedAccount).toBe('••••••7890');
    const item = diagnosis.differences.find(
      (d) => d.type === 'SALDO_FINAL_NO_CUADRA',
    )!;
    expect(item.difference).toBe(2000);
    expect(item.target).toEqual({
      kind: 'SNAPSHOT',
      target: 'BANK_BALANCE',
      targetId: 'bb1',
      field: 'final_balance',
    });
    expect(diagnosis.hasPendingDifferences).toBe(true);
  });

  it('a review adjustment changes only this day’s recalculation', () => {
    const diagnosis = diagnoseFinancialDay(
      baseDay({
        adjustments: [
          {
            id: 'a1',
            correctionId: 'k1',
            module: 'BANCOS',
            sourceTable: 'bank_account_movements',
            sourceId: 'm2',
            originalAmount: 3000,
            correctedAmount: 5000,
            delta: 2000,
            effects: [
              { scope: 'BANK', bankId: BANK, clientId: null, amount: 2000 },
            ],
          },
        ],
      }),
    );
    expect(diagnosis.banks[0].theoreticalClosing).toBe(120000);
    expect(diagnosis.banks[0].difference).toBe(0);
    expect(
      diagnosis.differences.some((d) => d.type === 'SALDO_FINAL_NO_CUADRA'),
    ).toBe(false);
    expect(diagnosis.movements.find((m) => m.id === 'm2')?.adjustment).toEqual({
      correctedAmount: 5000,
      delta: 2000,
    });
  });

  it('reports an opening that differs from the previous close as an inconsistency (never fixed automatically)', () => {
    const day = baseDay();
    day.banks[0].previousDayFinal = 99000;
    day.banks[0].nextDayPrevious = 121000;
    const diagnosis = diagnoseFinancialDay(day);
    const opening = diagnosis.differences.find(
      (d) => d.type === 'APERTURA_DISTINTA_AL_CIERRE_ANTERIOR',
    )!;
    expect(opening.difference).toBe(1000);
    const next = diagnosis.differences.find(
      (d) => d.type === 'DIA_SIGUIENTE_ABRE_DISTINTO',
    )!;
    expect(next.target).toEqual({ kind: 'INFO' });
  });

  it('does not invent a bank difference for a day before the ledger existed', () => {
    const day = baseDay({ date: '2026-09-02', bankMovements: [] });
    const diagnosis = diagnoseFinancialDay(day);
    expect(diagnosis.banks[0].ledgerAvailable).toBe(false);
    expect(diagnosis.banks[0].difference).toBeNull();
    expect(
      diagnosis.differences.some((d) => d.type === 'SALDO_FINAL_NO_CUADRA'),
    ).toBe(false);
  });

  it('explainDifference: exact, inverted sign and pair matches only', () => {
    const candidates = [
      {
        source: 'BANK_MOVEMENT' as const,
        id: 'x',
        label: 'x',
        amount: 500,
        date: DAY,
      },
      {
        source: 'BANK_MOVEMENT' as const,
        id: 'y',
        label: 'y',
        amount: 250,
        date: DAY,
      },
      {
        source: 'BANK_MOVEMENT' as const,
        id: 'z',
        label: 'z',
        amount: 300,
        date: DAY,
      },
      {
        source: 'BANK_MOVEMENT' as const,
        id: 'w',
        label: 'w',
        amount: 200,
        date: DAY,
      },
    ];
    const related = explainDifference(500, candidates);
    expect(related.find((r) => r.id === 'x')?.match).toBe('EXACT');
    expect(related.find((r) => r.id === 'y')?.match).toBe('SIGN_INVERTED');
    expect(
      related
        .filter((r) => r.match === 'PAIR')
        .map((r) => r.id)
        .sort(),
    ).toEqual(['w', 'z']);
    expect(explainDifference(0, candidates)).toEqual([]);
  });

  it('cash: opening + entries − exits vs counted, and cut 1 → cut 2 handover', () => {
    const diagnosis = diagnoseFinancialDay(
      baseDay({
        banks: [],
        bankMovements: [],
        cashDay: {
          id: 'd1',
          status: 'CERRADO',
          openingPolicy: 'INHERITED_FROM_CLOSE',
          openingSystemCash: 5000,
          openingPhysicalCash: 5000,
          previousClosingPhysicalCash: 5000,
          previousClosingSystemCash: 5000,
          inheritedDifference: 0,
          openingSequence: 0,
          closingSequence: 3,
          closingSystemCash: 6000,
          closingPhysicalCash: 5900,
          closingDifference: -100,
          totalIn: 1000,
          totalOut: 0,
          movementCount: 1,
          openedAt: at,
          closedAt: at,
          previousDayDate: '2026-10-14',
          previousDayClosingPhysical: 5000,
          nextDayDate: null,
          nextDayOpeningPhysical: null,
        },
        cashMovements: [
          {
            id: 'k1',
            sequence: 1,
            movementType: 'ENTRADA_MANUAL',
            direction: 'IN',
            amount: 1000,
            previousBalance: 5000,
            newBalance: 6000,
            status: 'VIGENTE',
            referenceType: null,
            referenceId: null,
            description: 'Entrada',
            bankName: null,
            cutPeriodId: null,
            createdAt: at,
            username: 'admin',
          },
        ],
        cuts: [1, 2].map((n) => ({
          id: `cut${n}`,
          periodNumber: n,
          status: 'FINALIZADO',
          scheduledStartAt: at,
          scheduledEndAt: at,
          actualStartedAt: at,
          actualFinishedAt: at,
          startSequence: n === 1 ? 0 : 1,
          closingSequence: n === 1 ? 1 : 3,
          openingSystemCash: n === 1 ? 5000 : 6000,
          openingPhysicalCash: n === 1 ? 5000 : 6050,
          closingSystemCash: 6000,
          closingPhysicalCash: n === 1 ? 6000 : 5900,
          cashDifference: n === 1 ? 0 : -100,
          totalIn: n === 1 ? 1000 : 0,
          totalOut: 0,
          movementCount: 1,
          reopenedCount: 0,
          rangeIn: n === 1 ? 1000 : 0,
          rangeOut: 0,
          rangeCount: 1,
          counts: [],
          bankReconciliations: [],
        })),
      }),
    );
    expect(diagnosis.cash.theoretical).toBe(6000);
    expect(diagnosis.cash.physicalDifference).toBe(-100);
    expect(diagnosis.cash.kardexDifference).toBe(0);
    const handover = diagnosis.differences.find(
      (d) => d.type === 'CORTE_2_ABRE_DISTINTO',
    )!;
    expect(handover.difference).toBe(50);
  });

  it('cuadre: result ≠ 0 and receivables recomputed from the day’s rows (no double counting)', () => {
    const diagnosis = diagnoseFinancialDay(
      baseDay({
        receivables: {
          clients: [
            {
              clientId: CLIENT,
              clientName: 'Cliente',
              opening: 1000,
              charges: 500,
              payments: 200,
              settlements: 300,
            },
          ],
          rows: [],
          lateRows: [],
        },
        reconciliation: {
          id: 'r1',
          totalCash: 5000,
          totalWarehouseCash: 0,
          totalBanks: 120000,
          totalAssets: 0,
          totalAccountsReceivable: 1100,
          result: -0.86,
          createdAt: at,
          username: 'admin',
          rowsForDate: 1,
        },
      }),
    );
    expect(diagnosis.receivables.totals.closing).toBe(1000);
    const ar = diagnosis.differences.find(
      (d) => d.type === 'CXC_DISTINTA_AL_CIERRE',
    )!;
    expect(ar.difference).toBe(100);
    const result = diagnosis.differences.find(
      (d) => d.type === 'RESULTADO_DEL_CUADRE',
    )!;
    expect(result.registered).toBe(-0.86);
    const formula = diagnosis.differences.find(
      (d) => d.type === 'RESULTADO_MAL_CALCULADO',
    )!;
    expect(formula.expected).toBe(126100);
  });

  it('cuadre: a bank total stored with the previous BI Club rule is not a difference', () => {
    const day = baseDay({ bankMovements: [] });
    day.banks.push({
      ...day.banks[0],
      bankId: 'bic',
      name: 'BI Club',
      specialAccount: 'BI_CLUB',
      accountTypeName: 'Linea Crédito',
      balanceRowId: 'bb2',
      finalBalance: 75000,
      previousBalance: 75000,
      previousDayFinal: 75000,
      nextDayPrevious: 75000,
    });
    const reconciliation = {
      id: 'r1',
      totalCash: 0,
      totalWarehouseCash: 0,
      totalAssets: 0,
      totalAccountsReceivable: 0,
      result: 0,
      createdAt: at,
      username: 'a',
      rowsForDate: 1,
    };
    const legacy = diagnoseFinancialDay({
      ...day,
      reconciliation: { ...reconciliation, totalBanks: 45000 },
    });
    expect(
      legacy.differences.some((d) => d.type === 'BANCOS_DISTINTOS_A_LA_FOTO'),
    ).toBe(false);
    const current = diagnoseFinancialDay({
      ...day,
      reconciliation: { ...reconciliation, totalBanks: 195000 },
    });
    expect(
      current.differences.some((d) => d.type === 'BANCOS_DISTINTOS_A_LA_FOTO'),
    ).toBe(false);
    const wrong = diagnoseFinancialDay({
      ...day,
      reconciliation: { ...reconciliation, totalBanks: 190000 },
    });
    expect(
      wrong.differences.find((d) => d.type === 'BANCOS_DISTINTOS_A_LA_FOTO')
        ?.difference,
    ).toBe(-5000);
  });

  it('photograph: summary of differences used for the before/after comparison', () => {
    const photo = photographOf(baseDay());
    expect(photo.totalDifference).toBe(2000);
    expect(photo.hasPendingDifferences).toBe(true);
    expect((photo.snapshot as { banks: unknown[] }).banks).toHaveLength(1);
  });

  it('cuadre: the recomputed result includes the cash under Bodega custody', () => {
    const diagnosis = diagnoseFinancialDay(
      baseDay({
        reconciliation: {
          id: 'r2',
          totalCash: 85000,
          totalWarehouseCash: 35000,
          totalBanks: 0,
          totalAssets: 120000,
          totalAccountsReceivable: 0,
          result: 0,
          createdAt: at,
          username: 'admin',
          rowsForDate: 1,
        },
      }),
    );
    expect(diagnosis.reconciliation.recomputedResult).toBe(0);
    expect(
      diagnosis.differences.some((d) => d.type === 'RESULTADO_MAL_CALCULADO'),
    ).toBe(false);
  });
});
