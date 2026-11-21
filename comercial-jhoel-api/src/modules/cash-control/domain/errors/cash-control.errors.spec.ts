import { cashControlErrorFromMessage } from './cash-control.errors';

describe('cashControlErrorFromMessage — detailed inventory messages', () => {
  it('Caja → Bodega over the official caja balance says how much is available', () => {
    const error = cashControlErrorFromMessage(
      'CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH:5000.00',
    );
    expect(error?.code).toBe('CASH_WAREHOUSE_TRANSFER_EXCEEDS_CASH');
    expect(error?.status).toBe(400);
    expect(error?.message).toBe(
      'No puedes trasladar más efectivo del disponible en Caja. Efectivo disponible: Q5,000.00.',
    );
  });

  it('names the denomination, what is available and what was requested (caja)', () => {
    const error = cashControlErrorFromMessage(
      'CASH_DENOMINATION_NOT_AVAILABLE:200:5:6',
    );
    expect(error?.code).toBe('CASH_DENOMINATION_NOT_AVAILABLE');
    expect(error?.status).toBe(409);
    expect(error?.message).toContain('Q200');
    expect(error?.message).toContain('disponibles 5, solicitados 6');
  });

  it('formats coins with two decimals (Bodega)', () => {
    const error = cashControlErrorFromMessage(
      'WAREHOUSE_DENOMINATION_NOT_AVAILABLE:0.25:0:4',
    );
    expect(error?.message).toContain('Q0.25');
    expect(error?.message).toContain('Bodega');
  });

  it('explains a Bodega count that does not match its balance', () => {
    const error = cashControlErrorFromMessage(
      'WAREHOUSE_COUNT_MISMATCH:200.00:35000.00',
    );
    expect(error?.status).toBe(409);
    expect(error?.message).toContain('Q200.00');
    expect(error?.message).toContain('Q35,000.00');
  });

  it('keeps the plain message for codes without detail, and ignores unknown codes', () => {
    expect(
      cashControlErrorFromMessage('CASH_CUSTODY_BREAKDOWN_REQUIRED')?.message,
    ).toContain('desglose');
    expect(cashControlErrorFromMessage('SOMETHING_ELSE:1')).toBeNull();
  });
});
