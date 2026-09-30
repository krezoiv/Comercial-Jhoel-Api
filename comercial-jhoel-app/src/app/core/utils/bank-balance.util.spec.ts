import {
  CREDIT_LINE_NO_AVAILABLE_MESSAGE,
  CREDIT_LINE_PAYMENT_EXCEEDED_MESSAGE,
  creditLineMovementError,
  creditLineStatus,
  formatSignedBankBalance,
  isFavorBalance,
  transferBalanceDelta,
} from './bank-balance.util';

describe('BI Club — línea de crédito (saldo = −disponible)', () => {
  it('−Q75,000: todo disponible, nada utilizado', () => {
    expect(creditLineStatus(-75000, 75000)).toEqual({ limit: 75000, balance: -75000, used: 0, available: 75000 });
  });

  it('−Q25,000: disponible Q25,000, utilizado Q50,000, el saldo conserva su signo', () => {
    expect(creditLineStatus(-25000, 75000)).toEqual({ limit: 75000, balance: -25000, used: 50000, available: 25000 });
  });

  it('Q0.00: línea agotada', () => {
    expect(creditLineStatus(0, 75000)).toEqual({ limit: 75000, balance: 0, used: 75000, available: 0 });
  });

  it('BI Club: enviar a Banco Industrial sube su saldo; recibir el pago lo baja', () => {
    expect(transferBalanceDelta('BI_CLUB', 'source', 75000)).toBe(75000);
    expect(transferBalanceDelta('BI_CLUB', 'destination', 75000)).toBe(-75000);
    expect(transferBalanceDelta('BANCO_INDUSTRIAL', 'destination', 75000)).toBe(75000);
    expect(transferBalanceDelta('BANCO_INDUSTRIAL', 'source', 75000)).toBe(-75000);
  });

  it('valida el disponible y el pago', () => {
    expect(creditLineMovementError(-75000, 75000, 75000)).toBeNull(); // usa todo
    expect(creditLineMovementError(-25000, 25000, 75000)).toBeNull(); // usa el resto exacto
    expect(creditLineMovementError(-25000, 25001, 75000)).toContain('excede el disponible'); // excede
    expect(creditLineMovementError(0, 1, 75000)).toBe(CREDIT_LINE_NO_AVAILABLE_MESSAGE); // agotada
    expect(creditLineMovementError(0, -75000, 75000)).toBeNull(); // pago total
    expect(creditLineMovementError(-50000, -25001, 75000)).toBe(CREDIT_LINE_PAYMENT_EXCEEDED_MESSAGE); // pago > utilizado
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
