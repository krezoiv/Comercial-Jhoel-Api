import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { PRESENTATION_TYPE_REPOSITORY } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../../presentation-types/domain/repositories/presentation-type.repository';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error';
import { InvalidPresentationDataError } from '../../domain/errors/invalid-presentation-data.error';
import {
  ProductPresentationOutput,
  toProductPresentationOutput,
} from '../dtos/inventory-output';

export interface CreatePresentationInput {
  productId: string;
  presentationTypeId: string;
  conversionFactor: number;
  costPrice: number;
  publicPrice: number;
}

/**
 * Admin-only (enforced at the controller via `@Roles`). "Unidad" (factor 1)
 * is never created here — it's auto-created once per product by
 * `CreateProductUseCase`; this use case is for additional presentations
 * (Caja, Paquete, ...), always picked from the master `presentation_types`
 * catalog — never free text (see that module's own doc comment for why).
 */
@Injectable()
export class CreatePresentationUseCase {
  constructor(
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(
    input: CreatePresentationInput,
  ): Promise<ProductPresentationOutput> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new ProductNotFoundError(input.productId);
    }

    const presentationType = await this.presentationTypeRepository.findById(
      input.presentationTypeId,
    );
    if (!presentationType || !presentationType.isActive) {
      throw new InvalidPresentationDataError(
        'El tipo de presentación seleccionado no existe o está inactivo.',
      );
    }

    if (
      !Number.isInteger(input.conversionFactor) ||
      input.conversionFactor <= 0
    ) {
      throw new InvalidPresentationDataError(
        'El factor de conversión debe ser un número entero mayor que cero.',
      );
    }
    if (input.costPrice < 0 || input.publicPrice < 0) {
      throw new InvalidPresentationDataError(
        'Los precios no pueden ser negativos.',
      );
    }

    const presentation = await this.presentationRepository.create({
      productId: input.productId,
      presentationTypeId: input.presentationTypeId,
      conversionFactor: input.conversionFactor,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
    });

    return toProductPresentationOutput(presentation);
  }
}
