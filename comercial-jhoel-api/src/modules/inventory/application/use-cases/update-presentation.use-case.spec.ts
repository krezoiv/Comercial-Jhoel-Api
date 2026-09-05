import { UpdatePresentationUseCase } from './update-presentation.use-case';
import {
  PresentationNotFoundError,
  UnidadPresentationImmutableError,
} from '../../domain/errors/presentation.errors';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { PresentationType } from '../../../presentation-types/domain/entities/presentation-type.entity';

function buildPresentationType(
  overrides: Partial<{ isActive: boolean }> = {},
): PresentationType {
  return PresentationType.create({
    id: 'presentation-type-2',
    name: 'Media caja',
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
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

describe('UpdatePresentationUseCase', () => {
  let presentationRepository: jest.Mocked<ProductPresentationRepository>;
  let presentationTypeRepository: jest.Mocked<PresentationTypeRepository>;
  let useCase: UpdatePresentationUseCase;

  beforeEach(() => {
    presentationRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ProductPresentationRepository>;
    presentationTypeRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PresentationTypeRepository>;
    useCase = new UpdatePresentationUseCase(
      presentationRepository,
      presentationTypeRepository,
    );
    presentationTypeRepository.findById.mockResolvedValue(
      buildPresentationType(),
    );
  });

  it('rejects when the presentation does not exist', async () => {
    presentationRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        presentationId: 'missing',
        presentationTypeId: 'presentation-type-2',
      }),
    ).rejects.toThrow(PresentationNotFoundError);
    expect(presentationRepository.update).not.toHaveBeenCalled();
  });

  it.each([
    { isActive: false },
    { presentationTypeId: 'presentation-type-2' },
    { conversionFactor: 6 },
  ])(
    'never lets the "Unidad" presentation be changed via %p',
    async (patch) => {
      presentationRepository.findById.mockResolvedValue(
        buildPresentation({ name: 'Unidad', conversionFactor: 1 }),
      );

      await expect(
        useCase.execute({ presentationId: 'presentation-1', ...patch }),
      ).rejects.toThrow(UnidadPresentationImmutableError);
      expect(presentationRepository.update).not.toHaveBeenCalled();
    },
  );

  it('lets "Unidad" have its prices updated', async () => {
    presentationRepository.findById.mockResolvedValue(
      buildPresentation({ name: 'Unidad', conversionFactor: 1 }),
    );
    presentationRepository.update.mockResolvedValue(
      buildPresentation({ name: 'Unidad', conversionFactor: 1 }),
    );

    await useCase.execute({
      presentationId: 'presentation-1',
      costPrice: 15,
      publicPrice: 25,
    });

    expect(presentationRepository.update).toHaveBeenCalledWith(
      'presentation-1',
      expect.objectContaining({ costPrice: 15, publicPrice: 25 }),
    );
  });

  it('rejects a presentation type that does not exist or is inactive', async () => {
    presentationRepository.findById.mockResolvedValue(buildPresentation());
    presentationTypeRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        presentationId: 'presentation-1',
        presentationTypeId: 'missing-type',
      }),
    ).rejects.toThrow(InvalidPresentationDataError);
    expect(presentationRepository.update).not.toHaveBeenCalled();
  });

  it.each([0, -1, 2.5])(
    'rejects a non-positive-integer conversion factor (%p) on a non-Unidad presentation',
    async (conversionFactor) => {
      presentationRepository.findById.mockResolvedValue(buildPresentation());

      await expect(
        useCase.execute({ presentationId: 'presentation-1', conversionFactor }),
      ).rejects.toThrow(InvalidPresentationDataError);
      expect(presentationRepository.update).not.toHaveBeenCalled();
    },
  );

  it.each([{ costPrice: -1 }, { publicPrice: -1 }])(
    'rejects a negative price (%p)',
    async (patch) => {
      presentationRepository.findById.mockResolvedValue(buildPresentation());

      await expect(
        useCase.execute({ presentationId: 'presentation-1', ...patch }),
      ).rejects.toThrow(InvalidPresentationDataError);
      expect(presentationRepository.update).not.toHaveBeenCalled();
    },
  );

  it('forwards every changed field on a valid update', async () => {
    presentationRepository.findById.mockResolvedValue(buildPresentation());
    presentationRepository.update.mockResolvedValue(
      buildPresentation({ name: 'Media caja' }),
    );

    await useCase.execute({
      presentationId: 'presentation-1',
      presentationTypeId: 'presentation-type-2',
    });

    expect(presentationRepository.update).toHaveBeenCalledWith(
      'presentation-1',
      expect.objectContaining({ presentationTypeId: 'presentation-type-2' }),
    );
  });
});
