import { GetBankDepositMonthlyCountUseCase } from './get-bank-deposit-monthly-count.use-case';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';

describe('GetBankDepositMonthlyCountUseCase', () => {
  let bankDepositRepository: jest.Mocked<BankDepositRepository>;
  let useCase: GetBankDepositMonthlyCountUseCase;

  beforeEach(() => {
    bankDepositRepository = {
      getReportSummary: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    useCase = new GetBankDepositMonthlyCountUseCase(bankDepositRepository);
  });

  it("queries from the 1st of the current month through today, and returns the summary's operationCount", async () => {
    bankDepositRepository.getReportSummary.mockResolvedValue({
      operationCount: 7,
      transactionCount: 15,
      totalAmount: 3500,
      byBank: [],
    });

    const result = await useCase.execute();

    const now = new Date();
    const expectedStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    expect(bankDepositRepository.getReportSummary).toHaveBeenCalledWith(
      expect.objectContaining({ startDate: expectedStart }),
    );
    expect(result.count).toBe(7);
    expect(result.month).toBe(expectedStart.slice(0, 7));
  });
});
