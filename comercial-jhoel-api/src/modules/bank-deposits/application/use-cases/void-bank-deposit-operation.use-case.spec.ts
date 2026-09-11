import { VoidBankDepositOperationUseCase } from './void-bank-deposit-operation.use-case';
import { BankDepositOperationNotFoundError } from '../../domain/errors/bank-deposit-operation-not-found.error';
import { BankDepositOperationAlreadyVoidedError } from '../../domain/errors/bank-deposit-operation-already-voided.error';
import { BankDepositRepository } from '../../domain/repositories/bank-deposit.repository';
import { BankDepositOperation } from '../../domain/entities/bank-deposit-operation.entity';

function buildOperation(
  overrides: Partial<{ isVoided: boolean }> = {},
): BankDepositOperation {
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
    operationDate: '2026-09-03',
    changeGiven: 0,
    clientName: null,
    clientId: null,
    userId: 'user-1',
    username: 'erick',
    createdAt: new Date(),
    updatedAt: new Date(),
    cashDetails: [],
    transactions: [],
    isVoided: overrides.isVoided ?? false,
    voidedAt: null,
    voidedBy: null,
    voidedByUsername: null,
    voidReason: null,
  });
}

describe('VoidBankDepositOperationUseCase', () => {
  let bankDepositRepository: jest.Mocked<BankDepositRepository>;
  let useCase: VoidBankDepositOperationUseCase;

  const input = {
    id: 'op-1',
    voidedBy: 'admin-1',
    reason: 'Registrado por error.',
  };

  beforeEach(() => {
    bankDepositRepository = {
      findById: jest.fn(),
      voidOperation: jest.fn(),
    } as unknown as jest.Mocked<BankDepositRepository>;
    useCase = new VoidBankDepositOperationUseCase(bankDepositRepository);
  });

  it('rejects when the operation does not exist', async () => {
    bankDepositRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      BankDepositOperationNotFoundError,
    );
    expect(bankDepositRepository.voidOperation).not.toHaveBeenCalled();
  });

  it('rejects an operation that was already voided', async () => {
    bankDepositRepository.findById.mockResolvedValue(
      buildOperation({ isVoided: true }),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      BankDepositOperationAlreadyVoidedError,
    );
    expect(bankDepositRepository.voidOperation).not.toHaveBeenCalled();
  });

  it('voids a valid, not-yet-voided operation', async () => {
    bankDepositRepository.findById.mockResolvedValue(buildOperation());
    bankDepositRepository.voidOperation.mockResolvedValue(
      buildOperation({ isVoided: true }),
    );

    const result = await useCase.execute(input);

    expect(bankDepositRepository.voidOperation).toHaveBeenCalledWith(
      'op-1',
      'admin-1',
      'Registrado por error.',
    );
    expect(result.isVoided).toBe(true);
  });
});
