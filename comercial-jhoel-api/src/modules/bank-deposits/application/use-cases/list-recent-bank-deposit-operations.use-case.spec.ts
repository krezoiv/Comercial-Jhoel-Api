import {
  ListRecentBankDepositOperationsUseCase,
  RECENT_BANK_DEPOSIT_OPERATIONS_LIMIT,
} from './list-recent-bank-deposit-operations.use-case';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';

function buildOperation(
  id: string,
  overrides: { isVoided?: boolean; transactionCount?: number } = {},
): BankDepositOperation {
  return BankDepositOperation.create({
    id,
    transactionBankId: 'bank-1',
    transactionBankName: 'GTC',
    bankAccountId: 'account-1',
    bankAccountName: 'GTC',
    bankAccountNumber: '123',
    transactionTypeId: 'type-1',
    transactionTypeName: 'Depósito',
    totalAmount: 1500,
    transactionCount: overrides.transactionCount ?? 1,
    totalCash: 0,
    totalDistributed: 1500,
    operationDate: '2026-11-02',
    changeGiven: 0,
    cashBreakdownEnabled: false,
    clientName: null,
    clientId: null,
    userId: 'user-1',
    username: 'erick',
    createdAt: new Date('2026-11-02T15:00:00Z'),
    updatedAt: new Date('2026-11-02T15:00:00Z'),
    cashDetails: [],
    transactions: [],
    isVoided: overrides.isVoided ?? false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
  });
}

describe('ListRecentBankDepositOperationsUseCase', () => {
  let repository: jest.Mocked<BankDepositRepository>;
  let useCase: ListRecentBankDepositOperationsUseCase;

  beforeEach(() => {
    repository = {
      findRecent: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    useCase = new ListRecentBankDepositOperationsUseCase(repository);
  });

  it('always asks the repository (SQL LIMIT) for exactly 10 rows', async () => {
    repository.findRecent.mockResolvedValue([]);

    await useCase.execute();

    expect(RECENT_BANK_DEPOSIT_OPERATIONS_LIMIT).toBe(10);
    expect(repository.findRecent).toHaveBeenCalledWith(10);
  });

  it('keeps the repository order (newest first) and one row per operation — never multiplied by its distributed transactions', async () => {
    repository.findRecent.mockResolvedValue([
      buildOperation('op-new', { transactionCount: 3 }),
      buildOperation('op-old'),
    ]);

    const result = await useCase.execute();

    expect(result.map((row) => row.id)).toEqual(['op-new', 'op-old']);
    expect(result[0].totalAmount).toBe(1500);
    expect(result[0].transactionCount).toBe(3);
  });

  it('returns voided operations flagged as such (list convention), not hidden', async () => {
    repository.findRecent.mockResolvedValue([
      buildOperation('op-1', { isVoided: true }),
    ]);

    const [row] = await useCase.execute();

    expect(row.isVoided).toBe(true);
  });

  it('returns an empty list when nothing has been registered yet', async () => {
    repository.findRecent.mockResolvedValue([]);

    await expect(useCase.execute()).resolves.toEqual([]);
  });
});
