import { CashMovement } from '../../../core/models';
import { bucketAmount, buildSummaryCards, canManageCuts, formatGuatemalaTime, isManualMovement, referenceLabel } from './cash-control.util';

describe('Control de Efectivo — util', () => {
  it('groups backend buckets into the summary cards without recomputing amounts', () => {
    const cards = buildSummaryCards([
      { movementType: 'DEPOSITO', totalIn: 5000, totalOut: 0, count: 2 },
      { movementType: 'GASTO_POR_COBRAR', totalIn: 0, totalOut: 500, count: 1 },
      { movementType: 'ENTRADA_MANUAL', totalIn: 100, totalOut: 0, count: 1 },
      { movementType: 'ANULACION', totalIn: 0, totalOut: 5000, count: 1 },
    ]);
    expect(cards.map((card) => card.key)).toEqual([
      'DEPOSITO',
      'RETIRO',
      'DESEMBOLSO_GENESIS',
      'PAGO_GENESIS',
      'REINTEGRO',
      'GASTO_POR_COBRAR',
      'ACTIVO',
      'RETIRO_BANCARIO',
      'DEPOSITO_BANCARIO',
      'ENTREGA_BODEGA',
      'OTROS',
    ]);
    expect(cards[0]).toEqual(jasmine.objectContaining({ totalIn: 5000, count: 2 }));
    expect(cards[5]).toEqual(jasmine.objectContaining({ totalOut: 500, count: 1 }));
    expect(cards[10]).toEqual(jasmine.objectContaining({ totalIn: 100, totalOut: 5000, count: 2 }));
  });

  it('reports the gross amount of one type per day (Reintegros have their own card)', () => {
    const buckets = [
      { movementType: 'REINTEGRO' as const, totalIn: 300, totalOut: 0, count: 1 },
      { movementType: 'RETIRO' as const, totalIn: 0, totalOut: 5000, count: 2 },
    ];
    expect(bucketAmount(buckets, 'RETIRO')).toBe(5000);
    expect(bucketAmount(buckets, 'DEPOSITO')).toBe(0);
    expect(buildSummaryCards(buckets).find((card) => card.key === 'REINTEGRO')?.totalIn).toBe(300);
  });

  it('formats times in America/Guatemala', () => {
    expect(formatGuatemalaTime('2026-11-10T19:00:00Z')).toBe('13:00');
    expect(formatGuatemalaTime(null)).toBe('—');
  });

  it('lets admins and shift supervisors run cuts, not cashiers (UX only)', () => {
    expect(canManageCuts('ADMIN')).toBeTrue();
    expect(canManageCuts('SUPERVISOR_DE_TURNO')).toBeTrue();
    expect(canManageCuts('USER')).toBeFalse();
  });

  it('identifies manual movements and labels references', () => {
    const base = { referenceType: null, referenceId: null } as Partial<CashMovement>;
    expect(isManualMovement({ ...base, movementType: 'AJUSTE' } as CashMovement)).toBeTrue();
    expect(isManualMovement({ ...base, movementType: 'DEPOSITO' } as CashMovement)).toBeFalse();
    expect(referenceLabel({ referenceType: 'BANK_DEPOSIT', referenceId: 'abcdef12-0000' } as CashMovement)).toBe('Transaccionar · ABCDEF12');
    expect(referenceLabel({ referenceType: null, referenceId: null } as CashMovement)).toBe('Control de Efectivo');
  });
});
