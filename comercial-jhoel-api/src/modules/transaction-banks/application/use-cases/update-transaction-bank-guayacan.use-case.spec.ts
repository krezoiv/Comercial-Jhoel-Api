import { UpdateTransactionBankUseCase } from './update-transaction-bank.use-case';
import { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBank } from '../../domain/entities/transaction-bank.entity';

function buildAgent(
  overrides: {
    cashBoxCode?: 'GUAYACAN' | null;
    commissionPerTransaction?: number | null;
  } = {},
): TransactionBank {
  return TransactionBank.create({
    id: 'agent-1',
    name: 'Cooperativa',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
    cashBoxCode: overrides.cashBoxCode ?? null,
    commissionPerTransaction: overrides.commissionPerTransaction ?? null,
  });
}

describe('UpdateTransactionBankUseCase — Cooperativa Guayacán', () => {
  let repository: jest.Mocked<TransactionBankRepository>;
  let useCase: UpdateTransactionBankUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      update: jest.fn().mockResolvedValue(buildAgent()),
    } as unknown as jest.Mocked<TransactionBankRepository>;
    useCase = new UpdateTransactionBankUseCase(repository);
  });

  it('marking it sets the cash box and the default Q3.00 commission', async () => {
    repository.findById.mockResolvedValue(buildAgent());

    await useCase.execute('agent-1', { isGuayacan: true, updatedBy: 'admin' });

    expect(repository.update).toHaveBeenCalledWith('agent-1', {
      cashBoxCode: 'GUAYACAN',
      commissionPerTransaction: 3,
      updatedBy: 'admin',
    });
  });

  it('keeps an existing rate when re-marking without one', async () => {
    repository.findById.mockResolvedValue(
      buildAgent({ cashBoxCode: 'GUAYACAN', commissionPerTransaction: 3.5 }),
    );

    await useCase.execute('agent-1', { isGuayacan: true, updatedBy: 'admin' });

    expect(repository.update).toHaveBeenCalledWith(
      'agent-1',
      expect.objectContaining({ commissionPerTransaction: 3.5 }),
    );
  });

  it('unmarking clears both the cash box and the commission', async () => {
    repository.findById.mockResolvedValue(
      buildAgent({ cashBoxCode: 'GUAYACAN', commissionPerTransaction: 3 }),
    );

    await useCase.execute('agent-1', { isGuayacan: false, updatedBy: 'admin' });

    expect(repository.update).toHaveBeenCalledWith('agent-1', {
      cashBoxCode: null,
      commissionPerTransaction: null,
      updatedBy: 'admin',
    });
  });

  it('never sets a commission on an agent that is not Guayacán', async () => {
    repository.findById.mockResolvedValue(buildAgent());

    await useCase.execute('agent-1', {
      commissionPerTransaction: 5,
      updatedBy: 'admin',
    });

    expect(repository.update).toHaveBeenCalledWith('agent-1', {
      updatedBy: 'admin',
    });
  });

  it('a plain rename leaves the Guayacán configuration untouched', async () => {
    repository.findById.mockResolvedValue(
      buildAgent({ cashBoxCode: 'GUAYACAN', commissionPerTransaction: 3 }),
    );
    repository.findByActiveName.mockResolvedValue(null);

    await useCase.execute('agent-1', {
      name: 'Cooperativa Guayacán',
      updatedBy: 'admin',
    });

    expect(repository.update).toHaveBeenCalledWith('agent-1', {
      name: 'Cooperativa Guayacán',
      updatedBy: 'admin',
    });
  });
});
