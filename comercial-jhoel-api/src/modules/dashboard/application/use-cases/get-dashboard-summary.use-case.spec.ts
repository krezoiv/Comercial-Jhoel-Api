import { GetDashboardSummaryUseCase } from './get-dashboard-summary.use-case';
import { DashboardRepository } from '../../domain/repositories/dashboard.repository';

describe('GetDashboardSummaryUseCase', () => {
  let dashboardRepository: jest.Mocked<DashboardRepository>;
  let useCase: GetDashboardSummaryUseCase;

  beforeEach(() => {
    dashboardRepository = {
      getSummary: jest.fn(),
    };
    useCase = new GetDashboardSummaryUseCase(dashboardRepository);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function emptyRawSummary() {
    return {
      rechargeSalesByDay: [],
      salesByDay: [],
      purchasesTotal: 0,
      bankTransactionsByBank: [],
    };
  }

  it('computes the period as the 1st of the current month through today — never a stored/fixed date', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 4, 15, 30)); // 2026-09-04
    dashboardRepository.getSummary.mockResolvedValue(emptyRawSummary());

    const result = await useCase.execute();

    expect(dashboardRepository.getSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        isoStartDate: '2026-09-01',
        isoEndDate: '2026-09-04',
      }),
    );
    expect(result.period).toEqual({
      year: 2026,
      month: 9,
      startDate: '2026-09-01',
      endDate: '2026-09-04',
    });
  });

  it('never includes the previous month — mes anterior stays entirely out of the query range', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 4)); // 2026-09-04
    dashboardRepository.getSummary.mockResolvedValue(emptyRawSummary());

    await useCase.execute();

    const period = dashboardRepository.getSummary.mock.calls[0][0];
    // "01/09" is the earliest possible date in range — 31/08 (mes anterior) is provably excluded.
    expect(period.isoStartDate).toBe('2026-09-01');
    expect(period.dayStart.getMonth()).toBe(8); // September (0-indexed)
    expect(period.dayStart.getDate()).toBe(1);
  });

  it('cambia de mes automáticamente el 01/09, sin ninguna lógica de "if (month === 9)"', async () => {
    dashboardRepository.getSummary.mockResolvedValue(emptyRawSummary());

    jest.useFakeTimers().setSystemTime(new Date(2026, 7, 31)); // 31/08/2026
    await useCase.execute();
    expect(dashboardRepository.getSummary).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isoStartDate: '2026-08-01',
        isoEndDate: '2026-08-31',
      }),
    );

    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 1)); // 01/09/2026 — the very next day
    await useCase.execute();
    expect(dashboardRepository.getSummary).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isoStartDate: '2026-09-01',
        isoEndDate: '2026-09-01',
      }),
    );
  });

  it('passes purchasesTotal straight through as { total }', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 4));
    dashboardRepository.getSummary.mockResolvedValue({
      ...emptyRawSummary(),
      purchasesTotal: 4000,
    });

    const result = await useCase.execute();

    expect(result.purchases).toEqual({ total: 4000 });
  });

  it('returns Q0.00-equivalent zeros and N/A-equivalent nulls when the month has no data at all', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 4));
    dashboardRepository.getSummary.mockResolvedValue(emptyRawSummary());

    const result = await useCase.execute();

    expect(result.rechargeSales).toEqual({
      highestDay: null,
      lowestDay: null,
      total: 0,
    });
    expect(result.sales).toEqual({
      highestDay: null,
      lowestDay: null,
      total: 0,
    });
    expect(result.purchases).toEqual({ total: 0 });
    expect(result.bankTransactions).toEqual({
      totalTransactions: 0,
      highestBank: null,
      lowestBank: null,
    });
  });

  it('assembles recharge sales, sales, and bank transactions from the raw repository rows', async () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 8, 4));
    dashboardRepository.getSummary.mockResolvedValue({
      rechargeSalesByDay: [
        { date: '2026-09-01', amount: 1000 },
        { date: '2026-09-04', amount: 3000 },
      ],
      salesByDay: [
        { date: '2026-09-02', amount: 1000 },
        { date: '2026-09-03', amount: 7000 },
      ],
      purchasesTotal: 4000,
      bankTransactionsByBank: [
        { bankId: 'b', bankName: 'Banco B', transactions: 10 },
        { bankId: 'c', bankName: 'Banco C', transactions: 2 },
      ],
    });

    const result = await useCase.execute();

    expect(result.rechargeSales.highestDay).toEqual({
      date: '2026-09-04',
      amount: 3000,
    });
    expect(result.sales.highestDay).toEqual({
      date: '2026-09-03',
      amount: 7000,
    });
    expect(result.bankTransactions.totalTransactions).toBe(12);
    expect(result.bankTransactions.highestBank?.bankName).toBe('Banco B');
    expect(result.bankTransactions.lowestBank?.bankName).toBe('Banco C');
  });
});
