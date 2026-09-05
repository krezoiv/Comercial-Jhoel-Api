import { RegisterInventoryTransferUseCase } from './register-inventory-transfer.use-case';
import {
  InvalidTransferQuantityError,
  SameLocationTransferError,
} from '../../domain/errors/transfer.errors';
import { InventoryTransferRepository } from '../../domain/repositories/inventory-transfer.repository';

describe('RegisterInventoryTransferUseCase', () => {
  let transferRepository: jest.Mocked<InventoryTransferRepository>;
  let useCase: RegisterInventoryTransferUseCase;

  const baseInput = {
    productId: 'product-1',
    fromLocationId: 'bodega',
    toLocationId: 'vitrina',
    quantity: 1,
    userId: 'user-1',
  };

  beforeEach(() => {
    transferRepository = {
      registerTransfer: jest.fn(),
    };
    useCase = new RegisterInventoryTransferUseCase(transferRepository);
  });

  it.each([0, -1, 1.5])(
    'rejects a non-positive-integer quantity (%p)',
    async (quantity) => {
      await expect(useCase.execute({ ...baseInput, quantity })).rejects.toThrow(
        InvalidTransferQuantityError,
      );
      expect(transferRepository.registerTransfer).not.toHaveBeenCalled();
    },
  );

  it('rejects a transfer whose origin and destination are the same location', async () => {
    await expect(
      useCase.execute({
        ...baseInput,
        fromLocationId: 'bodega',
        toLocationId: 'bodega',
      }),
    ).rejects.toThrow(SameLocationTransferError);
    expect(transferRepository.registerTransfer).not.toHaveBeenCalled();
  });

  it('delegates a valid transfer to the repository and returns its reference id', async () => {
    transferRepository.registerTransfer.mockResolvedValue('transfer-1');

    const result = await useCase.execute(baseInput);

    expect(transferRepository.registerTransfer).toHaveBeenCalledWith({
      productId: baseInput.productId,
      presentationId: null,
      fromLocationId: baseInput.fromLocationId,
      toLocationId: baseInput.toLocationId,
      quantityPresentation: baseInput.quantity,
      userId: baseInput.userId,
      reason: undefined,
    });
    expect(result).toEqual({ referenceId: 'transfer-1' });
  });
});
