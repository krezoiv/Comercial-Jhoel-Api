import { SetTransactionBankImageUseCase } from './set-transaction-bank-image.use-case';
import { RemoveTransactionBankImageUseCase } from './remove-transaction-bank-image.use-case';
import { GetTransactionBankImageUseCase } from './get-transaction-bank-image.use-case';
import { TransactionBankRepository } from '../../domain/repositories/transaction-bank.repository';
import { TransactionBank } from '../../domain/entities/transaction-bank.entity';
import { TransactionBankNotFoundError } from '../../domain/errors/transaction-bank-not-found.error';
import { InvalidTransactionBankImageError } from '../../domain/errors/invalid-transaction-bank-image.error';

function buildTransactionBank(hasImage = false): TransactionBank {
  return TransactionBank.create({
    id: 'bank-1',
    name: 'Banco Azteca',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'erick',
    updatedBy: null,
    updatedByUsername: null,
    hasImage,
  });
}

const PNG = { buffer: Buffer.from('png'), mimetype: 'image/png', size: 3 };

describe('Imagen de banco agente', () => {
  let repository: jest.Mocked<TransactionBankRepository>;

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
      setImage: jest.fn(),
      removeImage: jest.fn(),
      getImage: jest.fn(),
    } as unknown as jest.Mocked<TransactionBankRepository>;
  });

  it('guarda la imagen y devuelve hasImage = true', async () => {
    repository.findById
      .mockResolvedValueOnce(buildTransactionBank(false))
      .mockResolvedValueOnce(buildTransactionBank(true));
    const output = await new SetTransactionBankImageUseCase(repository).execute({
      transactionBankId: 'bank-1',
      image: PNG,
      userId: 'user-1',
    });
    expect(repository.setImage).toHaveBeenCalledWith(
      'bank-1',
      { data: PNG.buffer, mimeType: 'image/png', sizeBytes: 3 },
      'user-1',
    );
    expect(output.hasImage).toBe(true);
  });

  it('rechaza formato, tamaño o archivo faltante sin escribir nada', async () => {
    repository.findById.mockResolvedValue(buildTransactionBank());
    const useCase = new SetTransactionBankImageUseCase(repository);
    for (const image of [
      undefined,
      { ...PNG, mimetype: 'image/gif' },
      { ...PNG, size: 6 * 1024 * 1024 },
      { ...PNG, size: 0 },
    ]) {
      await expect(
        useCase.execute({ transactionBankId: 'bank-1', image, userId: 'user-1' }),
      ).rejects.toThrow(InvalidTransactionBankImageError);
    }
    expect(repository.setImage).not.toHaveBeenCalled();
  });

  it('banco inexistente → 404 al subir o quitar', async () => {
    repository.findById.mockResolvedValue(null);
    await expect(
      new SetTransactionBankImageUseCase(repository).execute({
        transactionBankId: 'x',
        image: PNG,
        userId: 'user-1',
      }),
    ).rejects.toThrow(TransactionBankNotFoundError);
    await expect(
      new RemoveTransactionBankImageUseCase(repository).execute('x', 'user-1'),
    ).rejects.toThrow(TransactionBankNotFoundError);
  });

  it('quitar imagen → hasImage = false', async () => {
    repository.findById
      .mockResolvedValueOnce(buildTransactionBank(true))
      .mockResolvedValueOnce(buildTransactionBank(false));
    const output = await new RemoveTransactionBankImageUseCase(repository).execute(
      'bank-1',
      'user-1',
    );
    expect(repository.removeImage).toHaveBeenCalledWith('bank-1', 'user-1');
    expect(output.hasImage).toBe(false);
  });

  it('sin imagen guardada → 404', async () => {
    repository.getImage.mockResolvedValue(null);
    await expect(
      new GetTransactionBankImageUseCase(repository).execute('bank-1'),
    ).rejects.toThrow(TransactionBankNotFoundError);
  });
});
