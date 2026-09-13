import { CreatePresentationUseCase } from './create-presentation.use-case';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import { Product } from '../../../products/domain/entities/product.entity';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { PresentationType } from '../../../presentation-types/domain/entities/presentation-type.entity';

function buildProduct(): Product {
  return Product.create({
    id: 'product-1',
    name: 'Lapicero BIC Negro',
    sku: null,
    categoryId: 'cat-1',
    categoryName: 'boligrafos',
    businessId: 'biz-1',
    businessName: 'Librería',
    unitOfMeasureId: 'uom-1',
    unitOfMeasureName: 'Unidad',
    unitOfMeasureAbbreviation: 'und',
    costPrice: 14.25,
    publicPrice: 24,
    wholesalePrice: 21,
    stock: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

function buildPresentationType(
  overrides: Partial<{ isActive: boolean }> = {},
): PresentationType {
  return PresentationType.create({
    id: 'presentation-type-1',
    name: 'Caja',
    code: null,
    description: null,
    isActive: overrides.isActive ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'user-1',
    createdByUsername: 'admin',
    updatedBy: null,
    updatedByUsername: null,
  });
}

function buildPresentation(
  overrides: Partial<{ name: string; conversionFactor: number }> = {},
): ProductPresentation {
  return ProductPresentation.create({
    id: 'presentation-1',
    productId: 'product-1',
    presentationTypeId: 'presentation-type-1',
    name: overrides.name ?? 'Caja',
    conversionFactor: overrides.conversionFactor ?? 12,
    costPrice: 14.25,
    publicPrice: 21,
    barcode: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('CreatePresentationUseCase', () => {
  let presentationRepository: jest.Mocked<ProductPresentationRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let presentationTypeRepository: jest.Mocked<PresentationTypeRepository>;
  let useCase: CreatePresentationUseCase;

  const validInput = {
    productId: 'product-1',
    presentationTypeId: 'presentation-type-1',
    conversionFactor: 12,
    costPrice: 14.25,
    publicPrice: 21,
  };

  beforeEach(() => {
    presentationRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ProductPresentationRepository>;
    productRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;
    presentationTypeRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PresentationTypeRepository>;
    useCase = new CreatePresentationUseCase(
      presentationRepository,
      productRepository,
      presentationTypeRepository,
    );
    presentationTypeRepository.findById.mockResolvedValue(
      buildPresentationType(),
    );
  });

  it('rejects when the target product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      ProductNotFoundError,
    );
    expect(presentationRepository.create).not.toHaveBeenCalled();
  });

  it('rejects when the presentation type does not exist or is inactive', async () => {
    productRepository.findById.mockResolvedValue(buildProduct());
    presentationTypeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(
      InvalidPresentationDataError,
    );
    expect(presentationRepository.create).not.toHaveBeenCalled();
  });

  it('rejects an inactive presentation type', async () => {
    productRepository.findById.mockResolvedValue(buildProduct());
    presentationTypeRepository.findById.mockResolvedValue(
      buildPresentationType({ isActive: false }),
    );

    await expect(useCase.execute(validInput)).rejects.toThrow(
      InvalidPresentationDataError,
    );
    expect(presentationRepository.create).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5])(
    'rejects a non-positive-integer conversion factor (%p)',
    async (conversionFactor) => {
      productRepository.findById.mockResolvedValue(buildProduct());

      await expect(
        useCase.execute({ ...validInput, conversionFactor }),
      ).rejects.toThrow(InvalidPresentationDataError);
      expect(presentationRepository.create).not.toHaveBeenCalled();
    },
  );

  it.each([
    { costPrice: -1, publicPrice: 21 },
    { costPrice: 14.25, publicPrice: -1 },
  ])('rejects a negative price (%p)', async (prices) => {
    productRepository.findById.mockResolvedValue(buildProduct());

    await expect(useCase.execute({ ...validInput, ...prices })).rejects.toThrow(
      InvalidPresentationDataError,
    );
    expect(presentationRepository.create).not.toHaveBeenCalled();
  });

  it('creates the presentation from the selected catalog type when every rule passes', async () => {
    productRepository.findById.mockResolvedValue(buildProduct());
    presentationRepository.create.mockResolvedValue(buildPresentation());

    const result = await useCase.execute(validInput);

    expect(presentationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        presentationTypeId: 'presentation-type-1',
        conversionFactor: 12,
      }),
    );
    expect(result.name).toBe('Caja');
  });
});
