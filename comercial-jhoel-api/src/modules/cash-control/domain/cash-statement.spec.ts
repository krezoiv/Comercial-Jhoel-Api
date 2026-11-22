import {
  buildCashStatementSummary,
  countResult,
  latestCount,
  theoreticalBalance,
  type CashStatementCount,
  type CashStatementPeriod,
  type CashStatementTotals,
} from './cash-statement';

const period = (
  over: Partial<CashStatementPeriod> = {},
): CashStatementPeriod => ({
  kind: 'BANK_DAY',
  location: 'CAJA',
  businessDate: '2099-06-01',
  dateFrom: '2099-06-01',
  dateTo: '2099-06-01',
  windowStart: new Date('2099-06-01T14:00:00Z'),
  windowEnd: null,
  startSequence: 10,
  endSequence: null,
  isCurrent: true,
  agentDayStatus: 'ABIERTO',
  openedByUsername: 'admin',
  anchorOpeningBalance: 5250,
  anchorSource: 'APERTURA',
  ...over,
});

const totals = (
  over: Partial<CashStatementTotals> = {},
): CashStatementTotals => ({
  openingBalance: 5250,
  totalIn: 6700,
  totalOut: 3500,
  movementCount: 6,
  kardexClosingBalance: 8450,
  lastMovement: null,
  toWarehouse: 0,
  fromWarehouse: 0,
  ...over,
});

const count = (over: Partial<CashStatementCount> = {}): CashStatementCount => ({
  id: 'c1',
  source: 'ARQUEO_CAJA',
  number: 'Arqueo de Caja #1',
  countedAt: new Date('2099-06-01T20:00:00Z'),
  sequence: 16,
  theoretical: 8450,
  counted: 8400,
  difference: -50,
  result: 'FALTANTE',
  status: 'VIGENTE',
  username: 'super',
  observations: null,
  ...over,
});

describe('Estado de Cuenta de Efectivo — reglas', () => {
  it('saldo inicial + entradas − salidas = saldo teórico (the owner example), in cents', () => {
    expect(theoreticalBalance(5250, 6700, 3500)).toBe(8450);
    expect(theoreticalBalance(0.1, 0.2, 0)).toBe(0.3);
    expect(theoreticalBalance(100, 0, 0.01)).toBe(99.99);
  });

  it('classifies the physical − theoretical difference', () => {
    expect(countResult(0)).toBe('CUADRADO');
    expect(countResult(-50)).toBe('FALTANTE');
    expect(countResult(0.05)).toBe('SOBRANTE');
    expect(countResult(0.001)).toBe('CUADRADO');
  });

  it('the latest VIGENTE count wins; a replaced one never does', () => {
    const early = count({
      id: 'a',
      countedAt: new Date('2099-06-01T15:00:00Z'),
    });
    const replaced = count({
      id: 'b',
      status: 'REEMPLAZADO',
      countedAt: new Date('2099-06-01T23:00:00Z'),
    });
    const late = count({
      id: 'c',
      countedAt: new Date('2099-06-01T21:00:00Z'),
    });
    expect(latestCount([early, replaced, late])?.id).toBe('c');
    expect(latestCount([replaced])).toBeNull();
  });

  it('a consistent day without counts: SIN_ARQUEO and no warnings', () => {
    const { summary, warnings } = buildCashStatementSummary({
      period: period(),
      totals: totals(),
      counts: [],
      movementsAfterLatest: 0,
      previousCount: null,
    });
    expect(summary).toMatchObject({
      theoreticalBalance: 8450,
      consistent: true,
      physical: { status: 'SIN_ARQUEO', count: null, movementsAfter: 0 },
    });
    expect(warnings).toEqual([]);
  });

  it('a faltante is shown as it is: never adjusts the theoretical balance', () => {
    const { summary } = buildCashStatementSummary({
      period: period(),
      totals: totals(),
      counts: [count()],
      movementsAfterLatest: 0,
      previousCount: null,
    });
    expect(summary.theoreticalBalance).toBe(8450);
    expect(summary.physical).toMatchObject({
      status: 'FALTANTE',
      count: { counted: 8400, difference: -50 },
    });
  });

  it('warns (never corrects) about the Kardex, the opening, an inherited difference and an outdated count', () => {
    const { warnings } = buildCashStatementSummary({
      period: period({ anchorOpeningBalance: 5000 }),
      totals: totals({ kardexClosingBalance: 8400 }),
      counts: [count({ result: 'CUADRADO', difference: 0, counted: 8450 })],
      movementsAfterLatest: 2,
      previousCount: count({ id: 'prev', difference: 25, result: 'SOBRANTE' }),
    });
    expect(warnings.map((w) => w.code)).toEqual([
      'KARDEX_INCONSISTENT',
      'OPENING_ANCHOR_MISMATCH',
      'PREVIOUS_CLOSE_DIFFERENCE',
      'MOVEMENTS_AFTER_COUNT',
    ]);
    expect(warnings[0].message).toContain('Q8,450.00');
    expect(warnings[2].message).toContain('sobrante de Q25.00');
  });

  it('users without custody permission get no physical data at all', () => {
    const { summary, warnings } = buildCashStatementSummary({
      period: period(),
      totals: totals(),
      counts: null,
      movementsAfterLatest: 0,
      previousCount: null,
    });
    expect(summary.physical).toBeNull();
    expect(warnings).toEqual([]);
  });
});
