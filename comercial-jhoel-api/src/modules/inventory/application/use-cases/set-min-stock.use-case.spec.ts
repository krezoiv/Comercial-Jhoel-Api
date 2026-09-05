import { SetMinStockUseCase } from './set-min-stock.use-case';
import { InventoryStockRepository } from '../../domain/repositories/inventory-stock.repository';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import { InventoryStock } from '../../domain/entities/inventory-stock.entity';

function makeStock(minStock: number): InventoryStock {
  return InventoryStock.create({
    productId: 'product-1',
    locationId: 'location-1',
    locationName: 'Bodega',
    quantity: 20,
    minStock,
    updatedAt: new Date(),
  });
}

describe('SetMinStockUseCase', () => {
  let repository: jest.Mocked<InventoryStockRepository>;
  let useCase: SetMinStockUseCase;

  beforeEach(() => {
    repository = {
      setMinStock: jest.fn(),
    } as unknown as jest.Mocked<InventoryStockRepository>;
    useCase = new SetMinStockUseCase(repository);
  });

  it('rejects a negative minStock', async () => {
    await expect(
      useCase.execute({
        productId: 'product-1',
        locationId: 'location-1',
        minStock: -1,
      }),
    ).rejects.toThrow(InvalidPresentationDataError);
    expect(repository.setMinStock).not.toHaveBeenCalled();
  });

  it('rejects a non-integer minStock', async () => {
    await expect(
      useCase.execute({
        productId: 'product-1',
        locationId: 'location-1',
        minStock: 2.5,
      }),
    ).rejects.toThrow(InvalidPresentationDataError);
    expect(repository.setMinStock).not.toHaveBeenCalled();
  });

  it('accepts zero as a valid minStock (means "no threshold")', async () => {
    repository.setMinStock.mockResolvedValue(makeStock(0));

    const result = await useCase.execute({
      productId: 'product-1',
      locationId: 'location-1',
      minStock: 0,
    });

    expect(repository.setMinStock).toHaveBeenCalledWith(
      'product-1',
      'location-1',
      0,
    );
    expect(result.minStock).toBe(0);
  });

  it('persists a valid positive integer threshold', async () => {
    repository.setMinStock.mockResolvedValue(makeStock(10));

    const result = await useCase.execute({
      productId: 'product-1',
      locationId: 'location-1',
      minStock: 10,
    });

    expect(result.minStock).toBe(10);
  });
});
