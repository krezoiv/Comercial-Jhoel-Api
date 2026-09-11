import { RegisterBankDepositOperationUseCase } from './register-bank-deposit-operation.use-case';
import { BankDepositDayNotOpenedError } from '../../domain/errors/bank-deposit-day-not-opened.error';
import { BankDepositDayAlreadyClosedError } from '../../domain/errors/bank-deposit-day-already-closed.error';
import { InvalidBankDepositClientError } from '../../domain/errors/invalid-bank-deposit-client.error';
import {
  BankDepositAccountsReceivableForbiddenError,
  BankDepositAccountsReceivableRequiresClientError,
  BankDepositAccountsReceivableWrongTypeError,
} from '../../domain/errors/bank-deposit-accounts-receivable.error';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { DayOpeningRepository } from '../../../banks/domain/repositories/day-opening.repository';
import { DayOpening } from '../../../banks/domain/entities/day-opening.entity';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';
import { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { Client } from '../../../clients/domain/entities/client.entity';
import { TransactionTypeRepository } from '../../../transaction-types/domain/repositories/transaction-type.repository';
import { TransactionType } from '../../../transaction-types/domain/entities/transaction-type.entity';
import { TransactionManager } from '../../../../shared/application/ports/transaction-manager.port';
import { RegisterAccountReceivableChargeUseCase } from '../../../accounts-receivable/application/use-cases/register-account-receivable-charge.use-case';
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

function buildOperation(overrides: { clientId?: string | null } = {}): BankDepositOperation {
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
    changeGiven: 0,
    clientName: null,
    clientId: overrides.clientId ?? null,
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

function buildClient(overrides: { isActive?: boolean } = {}): Client {
  return Client.create({
    id: 'client-1',
    name: 'Juan Pérez',
    isActive: overrides.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

function buildTransactionType(name: string): TransactionType {
  return TransactionType.create({
    id: 'type-1',
    name,
    icon: 'bank',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('RegisterBankDepositOperationUseCase', () => {
  let bankDepositRepository: jest.Mocked<BankDepositRepository>;
  let dayOpeningRepository: jest.Mocked<DayOpeningRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let transactionTypeRepository: jest.Mocked<TransactionTypeRepository>;
  let transactionManager: jest.Mocked<TransactionManager>;
  let registerAccountReceivableChargeUseCase: jest.Mocked<RegisterAccountReceivableChargeUseCase>;
  let useCase: RegisterBankDepositOperationUseCase;

  const input = {
    transactionBankId: 'bank-1',
    transactionTypeId: 'type-1',
    totalAmount: 500,
    cashDetails: [{ denomination: 200, quantity: 2 }],
    transactionAmounts: [250, 250],
    userId: 'user-1',
    isAdmin: false,
  };

  beforeEach(() => {
    bankDepositRepository = {
      registerOperation: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    dayOpeningRepository = {
      findByDate: jest.fn(),
    } as unknown as jest.Mocked<DayOpeningRepository>;
    clientRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ClientRepository>;
    transactionTypeRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<TransactionTypeRepository>;
    transactionManager = {
      runInTransaction: jest.fn((work) => work('ctx')),
    } as unknown as jest.Mocked<TransactionManager>;
    registerAccountReceivableChargeUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RegisterAccountReceivableChargeUseCase>;

    useCase = new RegisterBankDepositOperationUseCase(
      bankDepositRepository,
      dayOpeningRepository,
      clientRepository,
      transactionTypeRepository,
      transactionManager,
      registerAccountReceivableChargeUseCase,
    );

    dayOpeningRepository.findByDate.mockResolvedValue(
      buildDayOpening({ closedAt: null }),
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
    bankDepositRepository.registerOperation.mockResolvedValue(buildOperation());

    const result = await useCase.execute(input);

    expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
      expect.objectContaining({
        transactionBankId: input.transactionBankId,
        transactionTypeId: input.transactionTypeId,
        totalAmount: input.totalAmount,
        operationDate: todayIsoDate(),
        clientName: null,
        clientId: null,
      }),
    );
    expect(result.id).toBe('op-1');
  });

  it('defaults a missing clientName to null rather than undefined', async () => {
    bankDepositRepository.registerOperation.mockResolvedValue(buildOperation());

    await useCase.execute({ ...input, clientName: undefined });

    expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
      expect.objectContaining({ clientName: null }),
    );
  });

  describe('registered client (independent of the checkbox)', () => {
    it('rejects a clientId that does not exist', async () => {
      clientRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ ...input, clientId: 'client-1' }),
      ).rejects.toThrow(InvalidBankDepositClientError);
      expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
    });

    it('rejects a clientId that is inactive', async () => {
      clientRepository.findById.mockResolvedValue(buildClient({ isActive: false }));

      await expect(
        useCase.execute({ ...input, clientId: 'client-1' }),
      ).rejects.toThrow(InvalidBankDepositClientError);
      expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
    });

    it('resolves clientName from the real client and persists clientId, with no CxC charge when the checkbox is off', async () => {
      clientRepository.findById.mockResolvedValue(buildClient());
      bankDepositRepository.registerOperation.mockResolvedValue(
        buildOperation({ clientId: 'client-1' }),
      );

      await useCase.execute({ ...input, clientId: 'client-1' });

      expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
        expect.objectContaining({ clientId: 'client-1', clientName: 'Juan Pérez' }),
      );
      expect(bankDepositRepository.registerOperation.mock.calls[0]).toHaveLength(1);
      expect(transactionManager.runInTransaction).not.toHaveBeenCalled();
      expect(registerAccountReceivableChargeUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('sendToAccountsReceivable', () => {
    const sendInput = {
      ...input,
      clientId: 'client-1',
      isAdmin: true,
      sendToAccountsReceivable: true,
    };

    it('rejects when no clientId is provided', async () => {
      await expect(
        useCase.execute({ ...input, isAdmin: true, sendToAccountsReceivable: true }),
      ).rejects.toThrow(BankDepositAccountsReceivableRequiresClientError);
      expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
    });

    it('rejects a non-admin caller', async () => {
      clientRepository.findById.mockResolvedValue(buildClient());

      await expect(
        useCase.execute({ ...sendInput, isAdmin: false }),
      ).rejects.toThrow(BankDepositAccountsReceivableForbiddenError);
      expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
    });

    it('rejects a transaction type that is not "Depósito"', async () => {
      clientRepository.findById.mockResolvedValue(buildClient());
      transactionTypeRepository.findById.mockResolvedValue(
        buildTransactionType('Retiro'),
      );

      await expect(useCase.execute(sendInput)).rejects.toThrow(
        BankDepositAccountsReceivableWrongTypeError,
      );
      expect(bankDepositRepository.registerOperation).not.toHaveBeenCalled();
    });

    it('registers the deposit and the CxC charge atomically, tagged with the deposit as its origin', async () => {
      clientRepository.findById.mockResolvedValue(buildClient());
      transactionTypeRepository.findById.mockResolvedValue(
        buildTransactionType('Depósito'),
      );
      const operation = buildOperation({ clientId: 'client-1' });
      bankDepositRepository.registerOperation.mockResolvedValue(operation);

      const result = await useCase.execute(sendInput);

      expect(transactionManager.runInTransaction).toHaveBeenCalledTimes(1);
      expect(bankDepositRepository.registerOperation).toHaveBeenCalledWith(
        expect.objectContaining({ clientId: 'client-1' }),
        'ctx',
      );
      expect(registerAccountReceivableChargeUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: 'client-1',
          amount: input.totalAmount,
          referenceType: 'BANK_DEPOSIT',
          referenceId: operation.id,
          context: 'ctx',
        }),
      );
      expect(result.id).toBe('op-1');
    });
  });
});
