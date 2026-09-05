import { CreateTransactionBankUseCase } from './create-transaction-bank.use-case';
import { UpdateTransactionBankUseCase } from './update-transaction-bank.use-case';
import { DeactivateTransactionBankUseCase } from './deactivate-transaction-bank.use-case';
import { TransactionBankNameAlreadyExistsError } from '../../domain/errors/transaction-bank-name-already-exists.error';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBank } from '../../domain/entities/transaction-bank.entity';

function buildTransactionBank(
  overrides: Partial<{ name: string }> = {},
): TransactionBank {
  return TransactionBank.create({
    id: 'bank-1',
    name: overrides.name ?? 'Akísi',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('CreateTransactionBankUseCase', () => {
  let repository: jest.Mocked<TransactionBankRepository>;
  let useCase: CreateTransactionBankUseCase;

  beforeEach(() => {
    repository = {
      findByActiveName: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<TransactionBankRepository>;
    useCase = new CreateTransactionBankUseCase(repository);
  });

  it('rejects a duplicate active name', async () => {
    repository.findByActiveName.mockResolvedValue(buildTransactionBank());

    await expect(
      useCase.execute({ name: 'Akísi', createdBy: 'user-1' }),
    ).rejects.toThrow(TransactionBankNameAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('collapses internal whitespace and trims the name before checking/creating', async () => {
    repository.findByActiveName.mockResolvedValue(null);
    repository.create.mockResolvedValue(buildTransactionBank());

    await useCase.execute({ name: '  Akísi   BAC  ', createdBy: 'user-1' });

    expect(repository.findByActiveName).toHaveBeenCalledWith('Akísi BAC');
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Akísi BAC',
      createdBy: 'user-1',
    });
  });
});

describe('UpdateTransactionBankUseCase', () => {
  let repository: jest.Mocked<TransactionBankRepository>;
  let useCase: UpdateTransactionBankUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<TransactionBankRepository>;
    useCase = new UpdateTransactionBankUseCase(repository);
  });

  it('rejects when the target bank does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing', { updatedBy: 'user-1' }),
    ).rejects.toThrow(TransactionBankNotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('rejects renaming to a name already used by another active bank', async () => {
    repository.findById.mockResolvedValue(
      buildTransactionBank({ name: 'Akísi' }),
    );
    repository.findByActiveName.mockResolvedValue(
      buildTransactionBank({ name: 'BAC' }),
    );

    await expect(
      useCase.execute('bank-1', { name: 'BAC', updatedBy: 'user-1' }),
    ).rejects.toThrow(TransactionBankNameAlreadyExistsError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('never re-checks uniqueness when the name is unchanged', async () => {
    repository.findById.mockResolvedValue(
      buildTransactionBank({ name: 'Akísi' }),
    );
    repository.update.mockResolvedValue(
      buildTransactionBank({ name: 'Akísi' }),
    );

    await useCase.execute('bank-1', { name: 'Akísi', updatedBy: 'user-1' });

    expect(repository.findByActiveName).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith('bank-1', {
      name: 'Akísi',
      updatedBy: 'user-1',
    });
  });
});

describe('DeactivateTransactionBankUseCase', () => {
  let repository: jest.Mocked<TransactionBankRepository>;
  let useCase: DeactivateTransactionBankUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<TransactionBankRepository>;
    useCase = new DeactivateTransactionBankUseCase(repository);
  });

  it('rejects when the target bank does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(
      TransactionBankNotFoundError,
    );
    expect(repository.deactivate).not.toHaveBeenCalled();
  });

  it('deactivates an existing bank', async () => {
    repository.findById.mockResolvedValue(buildTransactionBank());

    await useCase.execute('bank-1');

    expect(repository.deactivate).toHaveBeenCalledWith('bank-1');
  });
});
