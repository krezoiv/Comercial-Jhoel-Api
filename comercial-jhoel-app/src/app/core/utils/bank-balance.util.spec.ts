import { formatSignedBankBalance, isFavorBalance } from './bank-balance.util';

describe('formatSignedBankBalance', () => {
  it('formats a positive balance normally', () => {
    expect(formatSignedBankBalance(10000)).toBe('Q 10,000.00');
  });

  it('formats zero as Q 0.00', () => {
    expect(formatSignedBankBalance(0)).toBe('Q 0.00');
  });

  it('keeps the real sign of a negative balance (never Math.abs)', () => {
    expect(formatSignedBankBalance(-5000)).toBe('-Q 5,000.00');
    expect(formatSignedBankBalance(-3000.5)).toBe('-Q 3,000.50');
  });
});

describe('isFavorBalance', () => {
  it('labels only a negative Génesis credit line as "saldo a favor"', () => {
    expect(isFavorBalance('GENESIS', -3000)).toBeTrue();
    expect(isFavorBalance('GENESIS', 0)).toBeFalse();
    expect(isFavorBalance('GENESIS', 2000)).toBeFalse();
    expect(isFavorBalance('BI_CLUB', -1)).toBeFalse();
    expect(isFavorBalance(null, -1)).toBeFalse();
  });
});
