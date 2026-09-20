import { RegisterInventoryTransferBatchUseCase } from './register-inventory-transfer-batch.use-case';
import {
  EmptyTransferBatchError,
  InvalidTransferQuantityError,
  SameLocationTransferError,
} from '../../domain/errors/transfer.errors';
import { InventoryTransferRepository } from '../../domain/repositories/inventory-transfer.repository';

describe('RegisterInventoryTransferBatchUseCase', () => {
  let transferRepository: jest.Mocked<InventoryTransferRepository>;
  let useCase: RegisterInventoryTransferBatchUseCase;

  const baseInput = {
    fromLocationId: 'bodega',
    toLocationId: 'vitrina',
    userId: 'user-1',
    items: [
      { productId: 'product-1', quantity: 3 },
      { productId: 'product-2', quantity: 2 },
    ],
  };

  beforeEach(() => {
    transferRepository = {
      registerTransfer: jest.fn(),
      registerTransferBatch: jest.fn(),
    };
    useCase = new RegisterInventoryTransferBatchUseCase(transferRepository);
  });

  it('rejects an empty item list', async () => {
    await expect(
      useCase.execute({ ...baseInput, items: [] }),
    ).rejects.toThrow(EmptyTransferBatchError);
    expect(transferRepository.registerTransferBatch).not.toHaveBeenCalled();
  });

  it('rejects same origin and destination', async () => {
    await expect(
      useCase.execute({ ...baseInput, fromLocationId: 'bodega', toLocationId: 'bodega' }),
    ).rejects.toThrow(SameLocationTransferError);
    expect(transferRepository.registerTransferBatch).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5])(
    'rejects a non-positive-integer quantity on any item (%p)',
    async (quantity) => {
      await expect(
        useCase.execute({
          ...baseInput,
          items: [{ productId: 'product-1', quantity }],
        }),
      ).rejects.toThrow(InvalidTransferQuantityError);
      expect(transferRepository.registerTransferBatch).not.toHaveBeenCalled();
    },
  );

  it('delegates every item to the repository in one batch call and returns all reference ids', async () => {
    transferRepository.registerTransferBatch.mockResolvedValue(['ref-1', 'ref-2']);

    const result = await useCase.execute(baseInput);

    expect(transferRepository.registerTransferBatch).toHaveBeenCalledWith([
      {
        productId: 'product-1',
        presentationId: null,
        fromLocationId: 'bodega',
        toLocationId: 'vitrina',
        quantityPresentation: 3,
        userId: 'user-1',
        reason: undefined,
      },
      {
        productId: 'product-2',
        presentationId: null,
        fromLocationId: 'bodega',
        toLocationId: 'vitrina',
        quantityPresentation: 2,
        userId: 'user-1',
        reason: undefined,
      },
    ]);
    expect(result).toEqual({ referenceIds: ['ref-1', 'ref-2'] });
  });
});
