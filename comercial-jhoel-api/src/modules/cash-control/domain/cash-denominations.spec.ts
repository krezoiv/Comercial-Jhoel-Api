import {
  CASH_DENOMINATIONS,
  breakdownTotal,
  completeBreakdown,
  isValidDenomination,
} from './cash-denominations';

describe('cash denominations', () => {
  it('lists Q200 … Q0.01 (12 rows, Q0.01 last)', () => {
    expect(CASH_DENOMINATIONS).toHaveLength(12);
    expect(CASH_DENOMINATIONS.at(-1)).toBe(0.01);
    expect(isValidDenomination(0.01)).toBe(true);
    expect(isValidDenomination(0.02)).toBe(false);
  });

  it('counts centavos exactly: 10 → Q0.10, 100 → Q1.00, 500 → Q5.00', () => {
    expect(breakdownTotal([{ denomination: 0.01, quantity: 10 }])).toBe(0.1);
    expect(breakdownTotal([{ denomination: 0.01, quantity: 100 }])).toBe(1);
    expect(breakdownTotal([{ denomination: 0.01, quantity: 500 }])).toBe(5);
    // 0.1 + 0.2 style float drift never appears.
    expect(
      breakdownTotal([
        { denomination: 0.1, quantity: 1 },
        { denomination: 0.05, quantity: 4 },
        { denomination: 0.01, quantity: 3 },
      ]),
    ).toBe(0.33);
  });

  it('acceptance scenario: totals Q4,882.50 with 100 × Q0.01, Q4,883.00 with 150', () => {
    const rows = [
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
    ].map(([denomination, quantity]) => ({ denomination, quantity }));
    expect(breakdownTotal(rows)).toBe(4882.5);
    rows[11].quantity = 150;
    expect(breakdownTotal(rows)).toBe(4883);
  });

  it('completes a historical breakdown with zeros without mutating it', () => {
    const stored = [{ denomination: 5, quantity: 3 }];
    const full = completeBreakdown(stored);
    expect(full).toHaveLength(12);
    expect(full.find((r) => r.denomination === 5)).toEqual({
      denomination: 5,
      quantity: 3,
      subtotal: 15,
    });
    expect(stored).toEqual([{ denomination: 5, quantity: 3 }]);
  });
});
