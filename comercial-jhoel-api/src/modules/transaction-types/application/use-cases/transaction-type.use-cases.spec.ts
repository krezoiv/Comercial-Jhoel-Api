import { CreateTransactionTypeUseCase } from './create-transaction-type.use-case';
import { UpdateTransactionTypeUseCase } from './update-transaction-type.use-case';
import { DeactivateTransactionTypeUseCase } from './deactivate-transaction-type.use-case';
import { TransactionTypeNameAlreadyExistsError } from '../../domain/errors/transaction-type-name-already-exists.error';
import { TransactionTypeNotFoundError } from '../../domain/errors/transaction-type-not-found.error';
import { TransactionTypeRepository } from '../../domain/repositories/transaction-type.repository';
import { TransactionType } from '../../domain/entities/transaction-type.entity';

function buildTransactionType(
  overrides: Partial<{ name: string; icon: string }> = {},
): TransactionType {
  return TransactionType.create({
    id: 'type-1',
    name: overrides.name ?? 'Depósito',
    icon: overrides.icon ?? 'arrow-down-circle',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
  });
}

describe('CreateTransactionTypeUseCase', () => {
  let repository: jest.Mocked<TransactionTypeRepository>;
  let useCase: CreateTransactionTypeUseCase;

  beforeEach(() => {
    repository = {
      findByActiveName: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<TransactionTypeRepository>;
    useCase = new CreateTransactionTypeUseCase(repository);
  });

  it('rejects a duplicate active name', async () => {
    repository.findByActiveName.mockResolvedValue(buildTransactionType());

    await expect(
      useCase.execute({
        name: 'Depósito',
        icon: 'arrow-down-circle',
        createdBy: 'user-1',
      }),
    ).rejects.toThrow(TransactionTypeNameAlreadyExistsError);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('normalizes the name and forwards the icon on create', async () => {
    repository.findByActiveName.mockResolvedValue(null);
    repository.create.mockResolvedValue(buildTransactionType());

    await useCase.execute({
      name: '  Pago  de   Cheque  ',
      icon: 'file-check',
      createdBy: 'user-1',
    });

    expect(repository.create).toHaveBeenCalledWith({
      name: 'Pago de Cheque',
      icon: 'file-check',
      createdBy: 'user-1',
    });
  });
});

describe('UpdateTransactionTypeUseCase', () => {
  let repository: jest.Mocked<TransactionTypeRepository>;
  let useCase: UpdateTransactionTypeUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      findByActiveName: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<TransactionTypeRepository>;
    useCase = new UpdateTransactionTypeUseCase(repository);
  });

  it('rejects when the target type does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('missing', { updatedBy: 'user-1' }),
    ).rejects.toThrow(TransactionTypeNotFoundError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('rejects renaming to a name already used by another active type', async () => {
    repository.findById.mockResolvedValue(
      buildTransactionType({ name: 'Depósito' }),
    );
    repository.findByActiveName.mockResolvedValue(
      buildTransactionType({ name: 'Remesas' }),
    );

    await expect(
      useCase.execute('type-1', { name: 'Remesas', updatedBy: 'user-1' }),
    ).rejects.toThrow(TransactionTypeNameAlreadyExistsError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('leaves the icon untouched when none is provided', async () => {
    repository.findById.mockResolvedValue(buildTransactionType());
    repository.update.mockResolvedValue(buildTransactionType());

    await useCase.execute('type-1', { updatedBy: 'user-1' });

    expect(repository.update).toHaveBeenCalledWith('type-1', {
      updatedBy: 'user-1',
    });
  });
});

describe('DeactivateTransactionTypeUseCase', () => {
  let repository: jest.Mocked<TransactionTypeRepository>;
  let useCase: DeactivateTransactionTypeUseCase;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      deactivate: jest.fn(),
    } as unknown as jest.Mocked<TransactionTypeRepository>;
    useCase = new DeactivateTransactionTypeUseCase(repository);
  });

  it('rejects when the target type does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(
      TransactionTypeNotFoundError,
    );
    expect(repository.deactivate).not.toHaveBeenCalled();
  });

  it('deactivates an existing type', async () => {
    repository.findById.mockResolvedValue(buildTransactionType());

    await useCase.execute('type-1');

    expect(repository.deactivate).toHaveBeenCalledWith('type-1');
  });
});
