import {
  CASH_DENOMINATIONS,
  calculateCuadreResult,
  calculateTotalCash,
  cashCountFromRows,
  createEmptyCashCount,
  decimalPlacesFor,
  denominationSubtotal,
  hasAnyQuantity,
} from './cuadre-agentes.model';

describe('calculateCuadreResult (cuadre consolidado)', () => {
  it('includes the cash under Bodega custody: a caja → Bodega delivery never changes the result', () => {
    const before = calculateCuadreResult(100000, 50000, 10000, 180000, 20000);
    const after = calculateCuadreResult(85000, 50000, 10000, 180000, 35000);
    expect(before).toBe(0);
    expect(after).toBe(before);
  });

  it('keeps the previous formula when there is no Bodega cash', () => {
    expect(calculateCuadreResult(63550.9, -44443.05, 106946.66, 126055.39)).toBeCloseTo(-0.88, 2);
  });
});

describe('cash count (Q200 … Q0.01)', () => {
  const ACCEPTANCE: Array<[number, number]> = [
    [200, 10], [100, 20], [50, 10], [20, 10], [10, 10], [5, 10],
    [1, 20], [0.5, 10], [0.25, 20], [0.1, 10], [0.05, 10], [0.01, 100],
  ];
  const rows = (pairs: Array<[number, number]>) => pairs.map(([denomination, quantity]) => ({ denomination, quantity }));

  it('has 12 denominations ending in Q0.01, all whole quantities', () => {
    expect([...CASH_DENOMINATIONS]).toEqual([200, 100, 50, 20, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.01]);
    expect(CASH_DENOMINATIONS.every((d) => decimalPlacesFor(d) === 0)).toBeTrue();
  });

  it('acceptance scenario: Q4,882.50 with 100 × Q0.01 and Q4,883.00 with 150', () => {
    const counts = cashCountFromRows(rows(ACCEPTANCE));
    expect(calculateTotalCash(counts)).toBe(4882.5);
    counts[0.01] = 150;
    expect(calculateTotalCash(counts)).toBe(4883);
  });

  it('counts centavos exactly (10 → Q0.10, 100 → Q1.00, 500 → Q5.00, no float drift)', () => {
    expect(denominationSubtotal(0.01, 10)).toBe(0.1);
    expect(denominationSubtotal(0.01, 100)).toBe(1);
    expect(denominationSubtotal(0.01, 500)).toBe(5);
    const counts = createEmptyCashCount();
    counts[0.1] = 1;
    counts[0.05] = 4;
    counts[0.01] = 3;
    expect(calculateTotalCash(counts)).toBe(0.33);
  });

  it('a historical arqueo without Q0.01 loads with Q0.01 = 0 and its own total', () => {
    const counts = cashCountFromRows(rows([[200, 10], [0.05, 10]]));
    expect(counts[0.01]).toBe(0);
    expect(calculateTotalCash(counts)).toBe(2000.5);
    expect(hasAnyQuantity(counts)).toBeTrue();
    expect(hasAnyQuantity(createEmptyCashCount())).toBeFalse();
  });
});
