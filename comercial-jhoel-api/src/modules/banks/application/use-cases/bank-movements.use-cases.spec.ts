import { RegisterBankTransferUseCase } from './register-bank-transfer.use-case';
import { VoidBankTransferUseCase } from './void-bank-transfer.use-case';
import { AdjustBankBalanceUseCase } from './adjust-bank-balance.use-case';
import { ListBankMovementsUseCase } from './list-bank-movements.use-case';
import { RegisterBankBalanceCreditUseCase } from './register-bank-balance-credit.use-case';
import { VoidBankBalanceCreditUseCase } from './void-bank-balance-credit.use-case';
import { ListBankBalanceCreditsUseCase } from './list-bank-balance-credits.use-case';
import { BankMovementRepository } from '../../domain/repositories/bank-movement.repository';
import { DayOpeningRepository } from '../../domain/repositories/day-opening.repository';
import { DayOpening } from '../../domain/entities/day-opening.entity';
import {
  BankAccountMovement,
  BankTransfer,
} from '../../domain/entities/bank-account-movement.entity';
import {
  BankOperationDayClosedError,
  BankOperationDayNotOpenedError,
  BankTransferAlreadyVoidedError,
  BankTransferDestinationRequiredError,
  BankTransferNotFoundError,
  InvalidBankMovementDateRangeError,
  InvalidMovementAmountError,
  MovementReasonRequiredError,
} from '../../domain/errors/bank-movement.errors';
import { todayIsoDate } from '../utils/today-iso-date';

function buildDayOpening(closedAt: Date | null): DayOpening {
  return DayOpening.create({
    id: 'day-1',
    date: todayIsoDate(),
    openedBy: 'user-1',
    openedByUsername: 'erick',
    openedAt: new Date(),
    closedAt,
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

function buildTransfer(
  status: 'APLICADO' | 'ANULADO' = 'APLICADO',
): BankTransfer {
  return {
    id: 'transfer-1',
    kind: 'TRANSFER',
    businessDate: todayIsoDate(),
    createdAt: new Date(),
    amount: 2000,
    userId: 'user-1',
    username: 'erick',
    referenceText: null,
    concept: null,
    status,
    source: {
      bankId: 'a',
      bankName: 'GTC',
      accountNumber: '1',
      balanceBefore: 5000,
      balanceAfter: 3000,
    },
    destination: {
      bankId: 'b',
      bankName: 'BAM',
      accountNumber: '2',
      balanceBefore: 10000,
      balanceAfter: 12000,
    },
  };
}

function mockRepository(): jest.Mocked<BankMovementRepository> {
  return {
    registerTransfer: jest.fn(),
    voidTransfer: jest.fn(),
    adjustBalance: jest.fn(),
    registerBalanceCredit: jest.fn(),
    voidBalanceCredit: jest.fn(),
    findMovements: jest.fn(),
    findByReference: jest.fn(),
    findTransferById: jest.fn(),
    findTransfers: jest.fn(),
    getTransfersSummary: jest.fn(),
    getLastMovementByBank: jest.fn(),
  };
}

describe('RegisterBankTransferUseCase', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let dayOpeningRepository: jest.Mocked<DayOpeningRepository>;
  let useCase: RegisterBankTransferUseCase;
  const input = {
    sourceBankId: 'a',
    destinationBankId: 'b',
    amount: 2000,
    userId: 'user-1',
  };

  beforeEach(() => {
    repository = mockRepository();
    dayOpeningRepository = {
      findByDate: jest.fn(),
    } as unknown as jest.Mocked<DayOpeningRepository>;
    useCase = new RegisterBankTransferUseCase(repository, dayOpeningRepository);
  });

  it('rejects when the business day was not opened', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(null);
    await expect(useCase.execute(input)).rejects.toThrow(
      BankOperationDayNotOpenedError,
    );
    expect(repository.registerTransfer).not.toHaveBeenCalled();
  });

  it('rejects when the business day is already closed', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(
      buildDayOpening(new Date()),
    );
    await expect(useCase.execute(input)).rejects.toThrow(
      BankOperationDayClosedError,
    );
    expect(repository.registerTransfer).not.toHaveBeenCalled();
  });

  it("delegates to the SQL function with today's business date and trimmed texts, never pre-validating balances", async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(buildDayOpening(null));
    repository.registerTransfer.mockResolvedValue('transfer-1');
    repository.findTransferById.mockResolvedValue(buildTransfer());

    const result = await useCase.execute({
      ...input,
      referenceText: '  REF-9 ',
      concept: '   ',
    });

    expect(repository.registerTransfer).toHaveBeenCalledWith({
      sourceBankId: 'a',
      destinationBankId: 'b',
      amount: 2000,
      businessDate: todayIsoDate(),
      userId: 'user-1',
      referenceText: 'REF-9',
      concept: null,
    });
    expect(result.source.balanceAfter).toBe(3000);
    expect(result.destination?.balanceAfter).toBe(12000);
  });
});

describe('RegisterBankTransferUseCase — retiro de efectivo', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let useCase: RegisterBankTransferUseCase;

  beforeEach(() => {
    repository = mockRepository();
    const dayOpeningRepository = {
      findByDate: jest.fn().mockResolvedValue(buildDayOpening(null)),
    } as unknown as jest.Mocked<DayOpeningRepository>;
    useCase = new RegisterBankTransferUseCase(repository, dayOpeningRepository);
    repository.registerTransfer.mockResolvedValue('transfer-1');
    repository.findTransferById.mockResolvedValue(buildTransfer());
  });

  it('envía destino nulo cuando es retiro de efectivo (aunque venga una cuenta destino)', async () => {
    await useCase.execute({
      sourceBankId: 'a',
      destinationBankId: 'b',
      cashWithdrawal: true,
      amount: 100,
      userId: 'u',
    });
    expect(repository.registerTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceBankId: 'a',
        destinationBankId: null,
        amount: 100,
      }),
    );
  });

  it('exige una cuenta destino si no es retiro de efectivo', async () => {
    await expect(
      useCase.execute({ sourceBankId: 'a', amount: 100, userId: 'u' }),
    ).rejects.toThrow(BankTransferDestinationRequiredError);
    expect(repository.registerTransfer).not.toHaveBeenCalled();
  });
});

describe('VoidBankTransferUseCase', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let useCase: VoidBankTransferUseCase;

  beforeEach(() => {
    repository = mockRepository();
    useCase = new VoidBankTransferUseCase(repository);
  });

  it('requires a reason', async () => {
    await expect(
      useCase.execute({ transferId: 't', reason: '  ', userId: 'u' }),
    ).rejects.toThrow(MovementReasonRequiredError);
  });

  it('404s on an unknown transfer', async () => {
    repository.findTransferById.mockResolvedValue(null);
    await expect(
      useCase.execute({ transferId: 't', reason: 'x', userId: 'u' }),
    ).rejects.toThrow(BankTransferNotFoundError);
  });

  it('rejects a transfer already voided', async () => {
    repository.findTransferById.mockResolvedValue(buildTransfer('ANULADO'));
    await expect(
      useCase.execute({ transferId: 't', reason: 'x', userId: 'u' }),
    ).rejects.toThrow(BankTransferAlreadyVoidedError);
    expect(repository.voidTransfer).not.toHaveBeenCalled();
  });

  it('voids through the SQL function (inverse movements, never a delete)', async () => {
    repository.findTransferById
      .mockResolvedValueOnce(buildTransfer())
      .mockResolvedValueOnce(buildTransfer('ANULADO'));
    const result = await useCase.execute({
      transferId: 'transfer-1',
      reason: ' error ',
      userId: 'admin',
    });
    expect(repository.voidTransfer).toHaveBeenCalledWith(
      'transfer-1',
      todayIsoDate(),
      'admin',
      'error',
    );
    expect(result.status).toBe('ANULADO');
  });
});

describe('AdjustBankBalanceUseCase', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let useCase: AdjustBankBalanceUseCase;

  beforeEach(() => {
    repository = mockRepository();
    useCase = new AdjustBankBalanceUseCase(repository);
  });

  it('requires a reason', async () => {
    await expect(
      useCase.execute({
        bankId: 'b',
        newBalance: 9500,
        reason: ' ',
        userId: 'admin',
      }),
    ).rejects.toThrow(MovementReasonRequiredError);
    expect(repository.adjustBalance).not.toHaveBeenCalled();
  });

  it('records the adjustment as a movement with reason, observation, user and business date', async () => {
    await useCase.execute({
      bankId: 'b',
      newBalance: 9500,
      reason: ' Corrección por diferencia bancaria ',
      observation: '',
      userId: 'admin',
    });
    expect(repository.adjustBalance).toHaveBeenCalledWith({
      bankId: 'b',
      newBalance: 9500,
      businessDate: todayIsoDate(),
      userId: 'admin',
      reason: 'Corrección por diferencia bancaria',
      observation: null,
    });
  });

  it('passes a negative target through (only Génesis accepts it — enforced in SQL)', async () => {
    await useCase.execute({
      bankId: 'g',
      newBalance: -5000,
      reason: 'x',
      userId: 'admin',
    });
    expect(repository.adjustBalance).toHaveBeenCalledWith(
      expect.objectContaining({ newBalance: -5000 }),
    );
  });
});

describe('ListBankMovementsUseCase', () => {
  it('rejects an inverted date range', async () => {
    const useCase = new ListBankMovementsUseCase(mockRepository());
    await expect(
      useCase.execute({ startDate: '2026-09-10', endDate: '2026-09-01' }),
    ).rejects.toThrow(InvalidBankMovementDateRangeError);
  });

  it('applies filters with default pagination', async () => {
    const repository = mockRepository();
    const useCase = new ListBankMovementsUseCase(repository);
    await useCase.execute({ bankId: 'b', movementType: 'DEPOSITO' });
    expect(repository.findMovements).toHaveBeenCalledWith(
      {
        startDate: undefined,
        endDate: undefined,
        bankId: 'b',
        movementType: 'DEPOSITO',
        userId: undefined,
      },
      1,
      50,
    );
  });
});

function buildCreditMovement(
  balanceBefore: number,
  amount: number,
  status: 'APLICADO' | 'ANULADO' = 'APLICADO',
): BankAccountMovement {
  return {
    id: 'movement-1',
    sequence: 10,
    bankId: 'bank-1',
    bankName: 'Banco Industrial',
    accountNumber: '123456789',
    accountTypeName: 'Monetaria',
    movementType: 'ACREDITACION_SALDO',
    origin: 'ACREDITACION_SALDO',
    amount,
    balanceBefore,
    balanceAfter: balanceBefore + amount,
    businessDate: todayIsoDate(),
    createdAt: new Date(),
    userId: 'user-1',
    username: 'erick',
    referenceType: 'ACREDITACION_SALDO',
    referenceId: 'operation-1',
    referenceText: null,
    concept: 'Acreditación de saldo',
    observation: null,
    counterpartBankId: null,
    counterpartBankName: null,
    counterpartAccountNumber: null,
    status,
    reversalOfId: null,
    reversedAt: null,
    reversedByUsername: null,
  };
}

describe('RegisterBankBalanceCreditUseCase', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let dayOpeningRepository: jest.Mocked<DayOpeningRepository>;
  let useCase: RegisterBankBalanceCreditUseCase;

  beforeEach(() => {
    repository = mockRepository();
    dayOpeningRepository = {
      findByDate: jest.fn().mockResolvedValue(buildDayOpening(null)),
    } as unknown as jest.Mocked<DayOpeningRepository>;
    useCase = new RegisterBankBalanceCreditUseCase(repository, dayOpeningRepository);
  });

  it.each([0, -100, -500.5, Number.NaN])('rejects a non-positive or invalid amount (%p) before touching the ledger', async (amount) => {
    await expect(
      useCase.execute({ bankId: 'bank-1', amount, userId: 'user-1' }),
    ).rejects.toThrow(InvalidMovementAmountError);
    expect(repository.registerBalanceCredit).not.toHaveBeenCalled();
  });

  it('rejects when the business day was not opened', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(null);
    await expect(
      useCase.execute({ bankId: 'bank-1', amount: 5000, userId: 'user-1' }),
    ).rejects.toThrow(BankOperationDayNotOpenedError);
    expect(repository.registerBalanceCredit).not.toHaveBeenCalled();
  });

  it('rejects when the business day is already closed', async () => {
    dayOpeningRepository.findByDate.mockResolvedValue(buildDayOpening(new Date()));
    await expect(
      useCase.execute({ bankId: 'bank-1', amount: 5000, userId: 'user-1' }),
    ).rejects.toThrow(BankOperationDayClosedError);
  });

  it("delegates to the SQL function with today's business date and trimmed texts, never computing a balance itself", async () => {
    repository.registerBalanceCredit.mockResolvedValue({
      operationId: 'operation-1',
      movement: buildCreditMovement(-5000, 2000),
    });

    const result = await useCase.execute({
      bankId: 'bank-1',
      amount: 2000,
      referenceText: '  BOL-123  ',
      observation: '   ',
      userId: 'user-1',
    });

    expect(repository.registerBalanceCredit).toHaveBeenCalledWith({
      bankId: 'bank-1',
      amount: 2000,
      businessDate: todayIsoDate(),
      userId: 'user-1',
      referenceText: 'BOL-123',
      observation: null,
    });
    // Saldo negativo + acreditación: suma con signo real, nunca Math.abs.
    expect(result.balanceBefore).toBe(-5000);
    expect(result.balanceAfter).toBe(-3000);
    expect(result.movementType).toBe('ACREDITACION_SALDO');
  });
});

describe('VoidBankBalanceCreditUseCase', () => {
  let repository: jest.Mocked<BankMovementRepository>;
  let useCase: VoidBankBalanceCreditUseCase;

  beforeEach(() => {
    repository = mockRepository();
    useCase = new VoidBankBalanceCreditUseCase(repository);
  });

  it('requires a reason', async () => {
    await expect(
      useCase.execute({ operationId: 'operation-1', reason: '  ', userId: 'user-1' }),
    ).rejects.toThrow(MovementReasonRequiredError);
    expect(repository.voidBalanceCredit).not.toHaveBeenCalled();
  });

  it('voids through the SQL function (inverse movement, never a delete) and returns the voided credit', async () => {
    repository.findByReference.mockResolvedValue([
      buildCreditMovement(10000, 5000, 'ANULADO'),
    ]);

    const result = await useCase.execute({
      operationId: 'operation-1',
      reason: ' Monto equivocado ',
      userId: 'admin-1',
    });

    expect(repository.voidBalanceCredit).toHaveBeenCalledWith(
      'operation-1',
      todayIsoDate(),
      'admin-1',
      'Monto equivocado',
    );
    expect(repository.findByReference).toHaveBeenCalledWith('ACREDITACION_SALDO', 'operation-1');
    expect(result.status).toBe('ANULADO');
  });
});

describe('ListBankBalanceCreditsUseCase', () => {
  it('reads the same ledger filtered by ACREDITACION_SALDO with default pagination', async () => {
    const repository = mockRepository();
    repository.findMovements.mockResolvedValue({ items: [], total: 0, page: 1, limit: 10 });

    await new ListBankBalanceCreditsUseCase(repository).execute({ bankId: 'bank-1' });

    expect(repository.findMovements).toHaveBeenCalledWith(
      { startDate: undefined, endDate: undefined, bankId: 'bank-1', movementType: 'ACREDITACION_SALDO' },
      1,
      10,
    );
  });
});
