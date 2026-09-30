import {
  CREDIT_LINE_NO_DEBT_MESSAGE,
  CREDIT_LINE_OVERPAYMENT_MESSAGE,
  creditLineLimitMessage,
  creditLineMovementError,
  creditLineStatus,
  formatSignedBankBalance,
  isFavorBalance,
  transferBalanceDelta,
} from './bank-balance.util';

describe('BI Club — línea de crédito', () => {
  it('Q0.00: nada utilizado, todo disponible', () => {
    expect(creditLineStatus(0, 75000)).toEqual({ limit: 75000, balance: 0, used: 0, available: 75000 });
  });

  it('-Q50,000: utilizado Q50,000, disponible Q25,000, el saldo conserva su signo', () => {
    expect(creditLineStatus(-50000, 75000)).toEqual({ limit: 75000, balance: -50000, used: 50000, available: 25000 });
  });

  it('-Q75,000: línea agotada', () => {
    expect(creditLineStatus(-75000, 75000)).toEqual({ limit: 75000, balance: -75000, used: 75000, available: 0 });
  });

  it('usar la línea (BI Club envía) resta; pagarla (BI Club recibe) suma', () => {
    expect(transferBalanceDelta('source', 75000)).toBe(-75000);
    expect(transferBalanceDelta('destination', 50000)).toBe(50000);
  });

  it('casos A–H', () => {
    expect(creditLineMovementError(0, -75000, 75000)).toBeNull(); // A
    expect(creditLineMovementError(-50000, -25000, 75000)).toBeNull(); // B
    expect(creditLineMovementError(-50000, -25001, 75000)).toBe(creditLineLimitMessage(75000)); // C
    expect(creditLineMovementError(-75000, -1, 75000)).toBe(creditLineLimitMessage(75000)); // D
    expect(creditLineMovementError(-75000, 50000, 75000)).toBeNull(); // E
    expect(creditLineMovementError(-75000, 75000, 75000)).toBeNull(); // F
    expect(creditLineMovementError(-25000, 25000, 75000)).toBeNull(); // G
    expect(creditLineMovementError(-25000, 26000, 75000)).toBe(CREDIT_LINE_OVERPAYMENT_MESSAGE); // H
    expect(creditLineMovementError(0, 1000, 75000)).toBe(CREDIT_LINE_NO_DEBT_MESSAGE);
  });
});

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
