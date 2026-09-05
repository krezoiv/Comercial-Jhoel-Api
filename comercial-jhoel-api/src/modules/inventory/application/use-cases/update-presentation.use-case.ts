import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { PRESENTATION_TYPE_REPOSITORY } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import {
  PresentationNotFoundError,
  UnidadPresentationImmutableError,
} from '../../domain/errors/presentation.errors';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import {
  ProductPresentationOutput,
  toProductPresentationOutput,
} from '../dtos/inventory-output';

export interface UpdatePresentationInput {
  presentationId: string;
  presentationTypeId?: string;
  conversionFactor?: number;
  costPrice?: number;
  publicPrice?: number;
  isActive?: boolean;
}

/** Admin-only. "Unidad" can have its prices updated (purchases already do this automatically) but never its presentation type, factor, or active state — every purchase/sale that omits a presentation depends on it always existing with factor 1. Presentations already used in a movement/purchase/sale are never deleted, only deactivated — same soft-delete convention as every other module in this app. */
@Injectable()
export class UpdatePresentationUseCase {
  constructor(
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(
    input: UpdatePresentationInput,
  ): Promise<ProductPresentationOutput> {
    const presentation = await this.presentationRepository.findById(
      input.presentationId,
    );
    if (!presentation) {
      throw new PresentationNotFoundError(input.presentationId);
    }

    const isUnidad = presentation.name === 'Unidad';
    if (
      isUnidad &&
      (input.isActive === false ||
        input.presentationTypeId !== undefined ||
        input.conversionFactor !== undefined)
    ) {
      throw new UnidadPresentationImmutableError();
    }

    if (input.presentationTypeId !== undefined) {
      const presentationType = await this.presentationTypeRepository.findById(
        input.presentationTypeId,
      );
      if (!presentationType || !presentationType.isActive) {
        throw new InvalidPresentationDataError(
          'El tipo de presentación seleccionado no existe o está inactivo.',
        );
      }
    }

    if (
      input.conversionFactor !== undefined &&
      (!Number.isInteger(input.conversionFactor) || input.conversionFactor <= 0)
    ) {
      throw new InvalidPresentationDataError(
        'El factor de conversión debe ser un número entero mayor que cero.',
      );
    }
    if (
      (input.costPrice !== undefined && input.costPrice < 0) ||
      (input.publicPrice !== undefined && input.publicPrice < 0)
    ) {
      throw new InvalidPresentationDataError(
        'Los precios no pueden ser negativos.',
      );
    }

    const updated = await this.presentationRepository.update(
      input.presentationId,
      {
        presentationTypeId: input.presentationTypeId,
        conversionFactor: input.conversionFactor,
        costPrice: input.costPrice,
        publicPrice: input.publicPrice,
        isActive: input.isActive,
      },
    );

    return toProductPresentationOutput(updated);
  }
}
