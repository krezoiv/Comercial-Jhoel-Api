import { GetBankDepositDailyStatsUseCase } from './get-bank-deposit-daily-stats.use-case';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';

describe('GetBankDepositDailyStatsUseCase', () => {
  let bankDepositRepository: jest.Mocked<BankDepositRepository>;
  let useCase: GetBankDepositDailyStatsUseCase;

  beforeEach(() => {
    bankDepositRepository = {
      getDailyTransactionCounts: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    useCase = new GetBankDepositDailyStatsUseCase(bankDepositRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('zero-fills every day of the current month, including days with no rows returned', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 15)); // 15 Sep 2026 (30-day month)
    bankDepositRepository.getDailyTransactionCounts.mockResolvedValue([
      { date: '2026-09-01', transactionCount: 15 },
      { date: '2026-09-04', transactionCount: 31 },
    ]);

    const result = await useCase.execute();

    expect(bankDepositRepository.getDailyTransactionCounts).toHaveBeenCalledWith(
      '2026-09-01',
      '2026-09-30',
    );
    expect(result.month).toBe('2026-09');
    expect(result.days).toHaveLength(30);
    expect(result.days[0]).toEqual({ date: '2026-09-01', transactionCount: 15 });
    expect(result.days[1]).toEqual({ date: '2026-09-02', transactionCount: 0 });
    expect(result.days[3]).toEqual({ date: '2026-09-04', transactionCount: 31 });
    expect(result.days[29]).toEqual({ date: '2026-09-30', transactionCount: 0 });
  });

  it('returns every day at 0 when the repository has no rows for the month', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 1, 10)); // 10 Feb 2026 (28-day month)
    bankDepositRepository.getDailyTransactionCounts.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.days).toHaveLength(28);
    expect(result.days.every((day) => day.transactionCount === 0)).toBe(true);
  });
});
