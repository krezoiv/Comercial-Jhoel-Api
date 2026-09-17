import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';
import { CatalogProductOutput, toCatalogProductOutput } from '../dtos/catalog-product-output';

export interface UpdateCatalogProductInput {
  catalogDescription?: string | null;
  userId: string;
}

/** Solo edita la descripción de catálogo — nombre/precio/categoría siempre se leen en vivo de Inventario, nunca se editan aquí. */
@Injectable()
export class UpdateCatalogProductUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string, input: UpdateCatalogProductInput): Promise<CatalogProductOutput> {
    const existing = await this.catalogProductRepository.findById(id);
    if (!existing) {
      throw new CatalogProductNotFoundError(id);
    }

    const updated = await this.catalogProductRepository.update(id, {
      catalogDescription:
        input.catalogDescription === undefined
          ? undefined
          : input.catalogDescription?.trim() || null,
      updatedBy: input.userId,
    });

    return toCatalogProductOutput(updated);
  }
}
