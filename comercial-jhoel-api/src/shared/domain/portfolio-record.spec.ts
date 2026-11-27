import {
  PortfolioRecordError,
  changesCashEffect,
  portfolioRecordErrorFromMessage,
  requireChangeReason,
} from './portfolio-record';

describe('Cuentas por Cobrar / Activos — reglas de cambio', () => {
  it('only amount and payment method change the cash effect (they need a reason)', () => {
    const current = { amount: 150, paymentMethod: 'EFECTIVO' as const };
    expect(changesCashEffect(current, { amount: 180 })).toBe(true);
    expect(changesCashEffect(current, { paymentMethod: 'BANCO' })).toBe(true);
    // Same values, or administrative data only: no cash change.
    expect(changesCashEffect(current, { amount: 150.0 })).toBe(false);
    expect(changesCashEffect(current, { paymentMethod: 'EFECTIVO' })).toBe(
      false,
    );
    expect(changesCashEffect(current, {})).toBe(false);
  });

  it('a record registered before the payment method existed behaves as cash', () => {
    const legacy = { amount: 100, paymentMethod: null };
    expect(changesCashEffect(legacy, { paymentMethod: 'EFECTIVO' })).toBe(
      false,
    );
    expect(changesCashEffect(legacy, { paymentMethod: 'BANCO' })).toBe(true);
  });

  it('a reason has at least 5 characters, normalized', () => {
    expect(requireChangeReason('  Monto   mal digitado ')).toBe(
      'Monto mal digitado',
    );
    const codeOf = (reason: string | undefined): string | null => {
      try {
        requireChangeReason(reason);
        return null;
      } catch (error) {
        return (error as PortfolioRecordError).code;
      }
    };
    expect(codeOf('no')).toBe('PORTFOLIO_CHANGE_REASON_REQUIRED');
    expect(codeOf(undefined)).toBe('PORTFOLIO_CHANGE_REASON_REQUIRED');
  });

  it('maps the database rule violations to clear errors', () => {
    expect(
      portfolioRecordErrorFromMessage('PORTFOLIO_LINKED_TO_OPERATION:abc'),
    ).toEqual(
      expect.objectContaining({
        code: 'PORTFOLIO_LINKED_TO_OPERATION',
        status: 409,
      }),
    );
    expect(
      portfolioRecordErrorFromMessage(
        'BANK_DEPOSIT_LINKED_CHARGE_HAS_PAYMENTS:x',
      )?.message,
    ).toContain('Anule primero esos pagos');
    expect(
      portfolioRecordErrorFromMessage('AR_BALANCE_WOULD_BE_NEGATIVE:-30.00')
        ?.status,
    ).toBe(409);
    expect(portfolioRecordErrorFromMessage('SOMETHING_ELSE')).toBeNull();
  });
});
