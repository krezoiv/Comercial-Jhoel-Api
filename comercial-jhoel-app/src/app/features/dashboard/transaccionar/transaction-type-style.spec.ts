import { transactionTypeStyle } from './transaction-type-style';

describe('transactionTypeStyle — identidad visual de las operaciones', () => {
  it('colours by balance effect: green, blue, violet, turquoise, red', () => {
    expect(transactionTypeStyle({ name: 'Depósitos', balanceEffect: 'DEPOSITO' }).color).toBe('#16a34a');
    expect(transactionTypeStyle({ name: 'Desembolsos Genesis', balanceEffect: 'DESEMBOLSO_GENESIS' }).color).toBe('#2563eb');
    expect(transactionTypeStyle({ name: 'Préstamos Genesis', balanceEffect: 'PAGO_GENESIS' }).color).toBe('#7c3aed');
    expect(transactionTypeStyle({ name: 'Reintegros Genesis', balanceEffect: 'REINTEGRO' }).color).toBe('#0891b2');
    expect(transactionTypeStyle({ name: 'Retiros', balanceEffect: 'RETIRO' }).color).toBe('#dc2626');
  });

  it('Pagos Varios (no balance effect) is orange; names work without an effect too', () => {
    expect(transactionTypeStyle({ name: 'Pagos Varios', balanceEffect: null }).color).toBe('#ea580c');
    expect(transactionTypeStyle({ name: 'Retiros', balanceEffect: null }).color).toBe('#dc2626');
    expect(transactionTypeStyle({ name: 'Préstamos Génesis', balanceEffect: null }).color).toBe('#7c3aed');
  });

  it('other operations get a stable, non-empty style and description', () => {
    const a = transactionTypeStyle({ name: 'Remesas', balanceEffect: null });
    const b = transactionTypeStyle({ name: 'Remesas', balanceEffect: null });
    expect(a).toEqual(b);
    expect(a.color).toMatch(/^#[0-9a-f]{6}$/);
    expect(a.description.length).toBeGreaterThan(0);
  });
});
