import { ValidateBankBalancesForDateUseCase } from './validate-bank-balances-for-date.use-case';
import { BankBalanceRepository } from '../../domain/repositories/bank-balance.repository';
import { BankBalanceView } from '../../domain/entities/bank-balance-view.entity';

function row(
  bankId: string,
  finalBalance: number | null,
  specialAccount: string | null = null,
): BankBalanceView {
  return {
    bankId,
    bankName: `Banco ${bankId}`,
    accountNumber: bankId,
    accountTypeName: 'Monetaria',
    previousBalance: 0,
    finalBalance,
    currentBalance: 0,
    specialAccount,
    maxBalance: null,
  };
}

function useCase(rows: BankBalanceView[]): ValidateBankBalancesForDateUseCase {
  return new ValidateBankBalancesForDateUseCase({
    findBalancesView: jest.fn().mockResolvedValue(rows),
  } as unknown as BankBalanceRepository);
}

describe('ValidateBankBalancesForDateUseCase', () => {
  it('a missing daily balance blocks Cuadre de Agentes', async () => {
    const result = await useCase([row('gtc', 100), row('bac', null)]).execute(
      '2026-11-02',
    );
    expect(result.canReconcile).toBe(false);
    expect(result.missingBanks.map((bank) => bank.id)).toEqual(['bac']);
  });

  it('Cooperativa Guayacán (cuadre propio) is not required and not counted', async () => {
    const result = await useCase([
      row('gtc', 100),
      row('guay', null, 'GUAYACAN'),
    ]).execute('2026-11-02');
    expect(result.canReconcile).toBe(true);
    expect(result.totalActiveBanks).toBe(1);
    expect(result.missingBanks).toEqual([]);
  });
});
