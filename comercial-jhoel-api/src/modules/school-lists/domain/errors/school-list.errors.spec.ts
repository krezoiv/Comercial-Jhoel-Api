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

  it('names the product without stock in Bodega', () => {
    expect(
      schoolListErrorFromMessage(
        'SCHOOL_INSUFFICIENT_STOCK:8:9:Cuaderno 100 hojas: rayado',
      ),
    ).toMatchObject({
      status: 409,
      message:
        'No hay existencias suficientes de "Cuaderno 100 hojas: rayado" en Bodega: disponibles 8, se necesitan 9.',
    });
  });

  it('explains why a list cannot be dispatched or allocated', () => {
    expect(
      schoolListErrorFromMessage('SCHOOL_SUPPLY_INCOMPLETE:3:Cuaderno: grande')
        ?.message,
    ).toBe(
      'No se puede despachar: faltan 3 unidad(es) de "Cuaderno: grande" por abastecer.',
    );
    expect(
      schoolListErrorFromMessage('SCHOOL_SUPPLY_NO_FREE_UNITS:0')?.status,
    ).toBe(409);
    expect(
      schoolListErrorFromMessage('SCHOOL_USE_DISPATCH')?.message,
    ).toContain('Preparar y despachar');
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
