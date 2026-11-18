import {
  schoolListError,
  schoolListErrorFromMessage,
} from './school-list.errors';

describe('Listas Escolares — SQL error mapping', () => {
  it('maps codes with their status', () => {
    expect(
      schoolListErrorFromMessage(
        'SCHOOL_LIST_FORBIDDEN:school_lists.payments.void',
      ),
    ).toMatchObject({
      code: 'SCHOOL_LIST_FORBIDDEN',
      status: 403,
    });
    expect(schoolListErrorFromMessage('SCHOOL_VERSION_CONFLICT')).toMatchObject(
      {
        status: 409,
      },
    );
    expect(schoolListErrorFromMessage('SCHOOL_QUOTE_NOT_FOUND')?.status).toBe(
      404,
    );
  });

  it('adds the detail sent by the SQL function', () => {
    expect(
      schoolListErrorFromMessage('SCHOOL_PAYMENT_EXCEEDS_BALANCE:550.00')
        ?.message,
    ).toBe('El pago supera el saldo pendiente (Q550.00).');
    expect(
      schoolListErrorFromMessage('SCHOOL_QUOTE_NOT_PAID:1200.5')?.message,
    ).toBe(
      'La cotización tiene un saldo pendiente de Q1,200.50; no se puede entregar.',
    );
    expect(
      schoolListErrorFromMessage('SCHOOL_QUOTE_CLOSED:CANCELADA')?.message,
    ).toBe('La cotización está cancelada y no admite esta operación.');
    // Product names may contain ":".
    expect(
      schoolListErrorFromMessage(
        'SCHOOL_PRICE_OVERRIDE_FORBIDDEN:Cuaderno 100 hojas: rayado',
      )?.message,
    ).toContain('"Cuaderno 100 hojas: rayado"');
  });

  it('ignores messages that are not from this module', () => {
    expect(schoolListErrorFromMessage('CASH_DAY_NOT_OPENED')).toBeNull();
    expect(schoolListErrorFromMessage('duplicate key value')).toBeNull();
  });

  it('falls back to a generic message for unknown codes', () => {
    expect(schoolListError('SCHOOL_SOMETHING_NEW')).toMatchObject({
      message: 'La operación no es válida.',
      status: 400,
    });
  });
});
