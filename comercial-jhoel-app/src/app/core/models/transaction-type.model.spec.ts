import { balanceEffectDirection } from './transaction-type.model';

describe('balanceEffectDirection', () => {
  it('every other bank: Depósito resta, Retiro suma (unchanged)', () => {
    expect(balanceEffectDirection('DEPOSITO')).toBe(-1);
    expect(balanceEffectDirection('RETIRO')).toBe(1);
    expect(balanceEffectDirection('DEPOSITO', null)).toBe(-1);
    expect(balanceEffectDirection('RETIRO', null)).toBe(1);
  });

  it('Cooperativa Guayacán: Depósito suma, Retiro resta', () => {
    expect(balanceEffectDirection('DEPOSITO', 'GUAYACAN')).toBe(1);
    expect(balanceEffectDirection('RETIRO', 'GUAYACAN')).toBe(-1);
  });

  it('Guayacán never changes Reintegro or the Génesis types', () => {
    expect(balanceEffectDirection('REINTEGRO', 'GUAYACAN')).toBe(-1);
    expect(balanceEffectDirection('DESEMBOLSO_GENESIS', 'GUAYACAN')).toBe(-1);
    expect(balanceEffectDirection('PAGO_GENESIS', 'GUAYACAN')).toBe(1);
    expect(balanceEffectDirection(null, 'GUAYACAN')).toBe(0);
  });
});
