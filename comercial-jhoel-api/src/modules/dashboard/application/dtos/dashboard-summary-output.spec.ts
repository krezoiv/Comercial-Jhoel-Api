import {
  summarizeBankTransactions,
  summarizeDailySeries,
} from './dashboard-summary-output';

describe('summarizeDailySeries', () => {
  it('returns nulls and a zero total for an empty month (sin datos)', () => {
    const result = summarizeDailySeries([]);

    expect(result).toEqual({ highestDay: null, lowestDay: null, total: 0 });
  });

  it('finds the highest/lowest day and sums the total — ventas de recargas example from the ticket', () => {
    const rows = [
      { date: '2026-09-01', amount: 1000 },
      { date: '2026-09-02', amount: 2000 },
      { date: '2026-09-03', amount: 500 },
      { date: '2026-09-04', amount: 3000 },
    ];

    const result = summarizeDailySeries(rows);

    expect(result.highestDay).toEqual({ date: '2026-09-04', amount: 3000 });
    expect(result.lowestDay).toEqual({ date: '2026-09-03', amount: 500 });
    expect(result.total).toBe(6500);
  });

  it('finds the highest/lowest day and sums the total — ventas generales example from the ticket', () => {
    const rows = [
      { date: '2026-09-01', amount: 5000 },
      { date: '2026-09-02', amount: 1000 },
      { date: '2026-09-03', amount: 7000 },
    ];

    const result = summarizeDailySeries(rows);

    expect(result.highestDay).toEqual({ date: '2026-09-03', amount: 7000 });
    expect(result.lowestDay).toEqual({ date: '2026-09-02', amount: 1000 });
    expect(result.total).toBe(13000);
  });

  it('breaks a tie for the highest day by picking the most recent date', () => {
    const rows = [
      { date: '2026-09-01', amount: 5000 },
      { date: '2026-09-02', amount: 1000 },
      { date: '2026-09-03', amount: 5000 },
    ];

    const result = summarizeDailySeries(rows);

    expect(result.highestDay).toEqual({ date: '2026-09-03', amount: 5000 });
  });

  it('breaks a tie for the lowest day by picking the most recent date', () => {
    const rows = [
      { date: '2026-09-01', amount: 1000 },
      { date: '2026-09-02', amount: 5000 },
      { date: '2026-09-03', amount: 1000 },
    ];

    const result = summarizeDailySeries(rows);

    expect(result.lowestDay).toEqual({ date: '2026-09-03', amount: 1000 });
  });

  it('never lets floating-point summation produce a non-2-decimal total', () => {
    const rows = [
      { date: '2026-09-01', amount: 0.1 },
      { date: '2026-09-02', amount: 0.2 },
    ];

    expect(summarizeDailySeries(rows).total).toBe(0.3);
  });
});

describe('summarizeBankTransactions', () => {
  it('returns nulls and a zero total when no bank had activity (sin datos)', () => {
    const result = summarizeBankTransactions([]);

    expect(result).toEqual({
      totalTransactions: 0,
      highestBank: null,
      lowestBank: null,
    });
  });

  it('sums the total and finds the highest/lowest bank — the exact A/B/C example from the ticket', () => {
    // Banco A: 3 operaciones x 2 transacciones = 6; Banco B: 2 x 5 = 10; Banco C: 1 x 2 = 2.
    const rows = [
      { bankId: 'a', bankName: 'Banco A', transactions: 6 },
      { bankId: 'b', bankName: 'Banco B', transactions: 10 },
      { bankId: 'c', bankName: 'Banco C', transactions: 2 },
    ];

    const result = summarizeBankTransactions(rows);

    expect(result.totalTransactions).toBe(18);
    expect(result.highestBank).toEqual({
      bankId: 'b',
      bankName: 'Banco B',
      transactions: 10,
    });
    expect(result.lowestBank).toEqual({
      bankId: 'c',
      bankName: 'Banco C',
      transactions: 2,
    });
  });

  it('breaks a tie for the highest bank alphabetically (A→Z)', () => {
    const rows = [
      { bankId: 'z', bankName: 'Zeta Bank', transactions: 10 },
      { bankId: 'a', bankName: 'Akísi', transactions: 10 },
    ];

    expect(summarizeBankTransactions(rows).highestBank).toEqual({
      bankId: 'a',
      bankName: 'Akísi',
      transactions: 10,
    });
  });

  it('breaks a tie for the lowest bank alphabetically (A→Z)', () => {
    const rows = [
      { bankId: 'z', bankName: 'Zeta Bank', transactions: 3 },
      { bankId: 'a', bankName: 'Akísi', transactions: 3 },
    ];

    expect(summarizeBankTransactions(rows).lowestBank).toEqual({
      bankId: 'a',
      bankName: 'Akísi',
      transactions: 3,
    });
  });

  it('never treats a bank with zero activity as the "lowest" — it simply never appears in rows', () => {
    // A bank with 0 transactions this month has no row at all (see the
    // repository's own GROUP BY, which only returns banks that appear in
    // at least one non-anulada operation) — this test documents that
    // summarizeBankTransactions has no special-casing for "0" because it
    // never receives it.
    const rows = [{ bankId: 'a', bankName: 'Banco A', transactions: 4 }];

    expect(summarizeBankTransactions(rows).lowestBank).toEqual({
      bankId: 'a',
      bankName: 'Banco A',
      transactions: 4,
    });
  });
});
