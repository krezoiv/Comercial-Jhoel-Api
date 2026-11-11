import {
  cashCountsToDetails,
  cashCountsTotal,
  cashStatus,
  emptyCashCounts,
  formatDifference,
  formatGuatemalaDateTime,
  formatIsoDate,
} from './guayacan-cash.util';

describe('guayacan-cash.util', () => {
  it('starts every one of the 11 denominations at zero', () => {
    const counts = emptyCashCounts();
    expect(Object.keys(counts).length).toBe(12);
    expect(cashCountsTotal(counts)).toBe(0);
  });

  it('adds bills and coins without float drift', () => {
    const counts = { ...emptyCashCounts(), '200': 2, '0.1': 3, '0.05': 1 };
    expect(cashCountsTotal(counts)).toBe(400.35);
  });

  it('builds API details — only filled rows for a movement, every row for an arqueo', () => {
    const counts = { ...emptyCashCounts(), '100': 1 };
    expect(cashCountsToDetails(counts, { keepZero: false })).toEqual([{ denomination: 100, quantity: 1 }]);
    expect(cashCountsToDetails(counts, { keepZero: true }).length).toBe(12);
  });

  it('status: green when it matches, red when over, yellow when short', () => {
    expect(cashStatus(500, 500)).toBe('green');
    expect(cashStatus(600, 500)).toBe('red');
    expect(cashStatus(400, 500)).toBe('yellow');
    expect(cashStatus(0, 0)).toBe('yellow');
  });

  it('formats dates in Guatemala, zero-padded', () => {
    expect(formatIsoDate('2026-11-02')).toBe('02/11/2026');
    // 02:05 UTC del 3 = 20:05 del 2 en Guatemala (UTC−6).
    expect(formatGuatemalaDateTime('2026-11-03T02:05:00Z')).toBe('02/11/2026 20:05');
  });

  it('formats an arqueo difference with an explicit sign', () => {
    expect(formatDifference(-50)).toBe('-Q 50.00');
    expect(formatDifference(25)).toBe('+Q 25.00');
    expect(formatDifference(0)).toBe('Q 0.00');
  });
});
