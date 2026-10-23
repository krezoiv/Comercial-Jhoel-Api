import { Bank, BankSpecialAccount, TransactionTypeBalanceEffect } from '../models';
import { normalizeBankName, resolveTransactionBankAccount, transactionBankMonogram } from './transaction-bank-account.util';

function account(id: string, name: string, specialAccount: BankSpecialAccount | null = null, overrides: Partial<Bank> = {}): Bank {
  return {
    id,
    name,
    accountNumber: `${id}-0001`,
    accountTypeId: 'type',
    accountTypeName: 'Monetaria',
    previousBalance: 0,
    finalBalance: 1000,
    specialAccount,
    maxBalance: null,
    availableInTransaccionar: true,
    isActive: true,
    createdAt: '',
    updatedAt: '',
    ...overrides,
  };
}

// Mismos nombres que hoy tiene Sistema → Bancos (incluida la cuenta "Akísi", que NO es la que afecta Akisi).
const ACCOUNTS: Bank[] = [
  account('akisi', 'Akísi'),
  account('genesis', 'Fundación Génesis Empresarial', 'GENESIS'),
  account('bac', 'Banco América Central'),
  account('bantrab', 'Banco de los Trabajadoes'),
  account('districol', 'Districol', 'DISTRICOL'),
  account('agro', 'Banco Agromercantil', 'BANCO_AGROMERCANTIL'),
  account('gtc', 'GTC'),
  account('bi', 'Banco Industrial', 'BANCO_INDUSTRIAL'),
  account('biclub', 'Bi Club Empresarial', 'BI_CLUB'),
  account('azteca', 'Banco Azteca'),
];

const EXPECTED: [agentName: string, accountId: string][] = [
  ['Akísi', 'genesis'],
  ['BAC', 'bac'],
  ['Bantrab', 'bantrab'],
  ['Districol - BAM', 'districol'],
  ['GTC', 'gtc'],
  ['Industrial', 'bi'],
  ['Banco Azteca', 'azteca'],
];

function resolvedIds(agentName: string, accounts: Bank[], effect: TransactionTypeBalanceEffect) {
  const result = resolveTransactionBankAccount({ name: agentName }, accounts, effect);
  return result.status === 'ok' ? result.accounts.map((a) => a.id) : result.status;
}

describe('Transaccionar — mapeo banco agente → cuenta afectada', () => {
  for (const effect of ['DEPOSITO', 'RETIRO'] as const) {
    for (const [agentName, accountId] of EXPECTED) {
      it(`${effect}: ${agentName} → ${accountId}`, () => {
        expect(resolvedIds(agentName, ACCOUNTS, effect)).toEqual([accountId]);
      });
    }
  }

  for (const [agentName, accountId] of EXPECTED.filter(([, id]) => id !== 'genesis')) {
    it(`REINTEGRO: ${agentName} → ${accountId}`, () => {
      expect(resolvedIds(agentName, ACCOUNTS, 'REINTEGRO')).toEqual([accountId]);
    });
  }

  it('REINTEGRO: Akisi → Génesis no puede ser el origen (misma regla del backend), sin caer en otra cuenta', () => {
    const result = resolveTransactionBankAccount({ name: 'Akisi' }, ACCOUNTS, 'REINTEGRO');
    expect(result.status).toBe('not-allowed');
  });

  it('acepta variantes de nombre del banco agente', () => {
    expect(resolvedIds('Banco de América Central', ACCOUNTS, 'DEPOSITO')).toEqual(['bac']);
    expect(resolvedIds('BAM', ACCOUNTS, 'DEPOSITO')).toEqual(['districol']);
    expect(resolvedIds('Banco Industrial', ACCOUNTS, 'DEPOSITO')).toEqual(['bi']);
    expect(resolvedIds('AKISI', ACCOUNTS, 'DEPOSITO')).toEqual(['genesis']);
  });

  it('Banco Industrial nunca resuelve a BI Club (cuenta especial distinta)', () => {
    expect(resolvedIds('Industrial', ACCOUNTS, 'RETIRO')).not.toContain('biclub');
  });

  it('banco sin regla: no se asigna ninguna cuenta', () => {
    expect(resolvedIds('Cooperativa', ACCOUNTS, 'DEPOSITO')).toBe('unmapped');
  });

  it('cuenta inexistente o inactiva: missing', () => {
    const withoutAzteca = ACCOUNTS.filter((a) => a.id !== 'azteca');
    expect(resolvedIds('Banco Azteca', withoutAzteca, 'DEPOSITO')).toBe('missing');
    const inactive = ACCOUNTS.map((a) => (a.id === 'bac' ? { ...a, isActive: false } : a));
    expect(resolvedIds('BAC', inactive, 'DEPOSITO')).toBe('missing');
  });

  it('cuenta no habilitada en Transaccionar: unavailable', () => {
    const disabled = ACCOUNTS.map((a) => (a.id === 'gtc' ? { ...a, availableInTransaccionar: false } : a));
    expect(resolvedIds('GTC', disabled, 'DEPOSITO')).toBe('unavailable');
  });

  it('varias cuentas del mismo banco: devuelve todas para elegir, nunca una por defecto', () => {
    const accounts = [...ACCOUNTS, account('gtc2', 'GTC'), account('gtc3', 'gtc', null, { availableInTransaccionar: false })];
    expect(resolvedIds('GTC', accounts, 'DEPOSITO')).toEqual(['gtc', 'gtc2']);
  });

  it('normaliza acentos, mayúsculas y guiones', () => {
    expect(normalizeBankName('  Districol - BAM ')).toBe('districol bam');
    expect(normalizeBankName('Akísi')).toBe('akisi');
  });

  it('sigla del icono', () => {
    expect(transactionBankMonogram({ name: 'Akísi' })).toBe('AK');
    expect(transactionBankMonogram({ name: 'Cooperativa Uno' })).toBe('CU');
  });
});
