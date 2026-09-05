import { RegisterBankDepositOperationUseCase } from './register-bank-deposit-operation.use-case';
import { BankDepositDayNotOpenedError } from '../../domain/errors/bank-deposit-day-not-opened.error';
import { BankDepositDayAlreadyClosedError } from '../../domain/errors/bank-deposit-day-already-closed.error';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { DayOpening } from '../../../banks/domain/entities/day-opening.entity';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import { todayIsoDate } from '../utils/today-iso-date';

function buildDayOpening(overrides: { closedAt: Date | null }): DayOpening {
  return DayOpening.create({
    id: 'day-1',
    date: todayIsoDate(),
    openedBy: 'user-1',
    openedByUsername: 'erick',
    openedAt: new Date(),
    closedAt: overrides.closedAt,
    closedBy: null,
    closedByUsername: '',
    reopenedAt: null,
    reopenedBy: null,
    reopenedByUsername: '',
    reopenReason: null,
    isCancelled: false,
    cancelledAt: null,
    cancelledBy: null,
    cancelledByUsername: '',
    cancelReason: null,
  });
}

function buildOperation(): BankDepositOperation {
  return BankDepositOperation.create({
    id: 'op-1',
    transactionBankId: 'bank-1',
    transactionBankName: 'Akísi',
    transactionTypeId: 'type-1',
    transactionTypeName: 'Depósito',
    totalAmount: 500,
    transactionCount: 2,
    totalCash: 500,
    totalDistributed: 500,
    operationDate: todayIsoDate(),
    clientName: null,
    userId: 'user-1',
    username: 'erick',
    createdAt: new Date(),
    updatedAt: new Date(),
    cashDetails: [],
    transactions: [],
    isVoided: false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
  });
}

describe('RegisterBankDepositOperationUseCase', () => {
  let bankDepositRepository: jest.Mocked<BankDepositRepository>;
  let dayOpeningRepository: jest.Mocked<DayOpeningRepository>;
  let useCase: RegisterBankDepositOperationUseCase;

  const input = {
    transactionBankId: 'bank-1',
    transactionTypeId: 'type-1',
    totalAmount: 500,
    cashDetails: [{ denomination: 200, quantity: 2 }],
    transactionAmounts: [250, 250],
    userId: 'user-1',
  };

  beforeEach(() => {
    bankDepositRepository = {
      registerOperation: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    dayOpeningRepository = {
      findByDate: jest.fn(),
    } as unknown as jest.Mocked<DayOpeningRepository>;
    useCase = new RegisterBankDepositOperationUseCase(
      bankDepositRepository,
      dayOpeningRepository,
    );
  });

  it('rejects when today has no day opening at all', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      BankDepositDayNotOpenedError,
    );
    expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
  });

  it('rejects when today has already been closed', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(
      buildDayOpening({ closedAt: new Date() }),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      BankDepositDayAlreadyClosedError,
    );
    expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
  });

  it("delegates to the repository with today's date once the day is open", async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(
      buildDayOpening({ closedAt: null }),
    );
    bankDepositRepository.registerOperation.mockResolvedValue(buildOperation());

    const result = await useCase.execute(input);

    expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionBankId: input.transactionBankId,
        transactionTypeId: input.transactionTypeId,
        totalAmount: input.totalAmount,
        operationDate: todayIsoDate(),
        clientName: null,
      }),
    );
    expect(result.id).toBe('op-1');
  });

  it('defaults a missing clientName to null rather than undefined', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(
      buildDayOpening({ closedAt: null }),
    );
    bankDepositRepository.registerOperation.mockResolvedValue(buildOperation());

    await useCase.execute({ ...input, clientName: undefined });

    expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
      expect.objectContaining({ clientName: null }),
    );
  });
});
