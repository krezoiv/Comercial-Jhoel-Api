import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CatalogProductNotFoundError } from '../../domain/errors/catalog-product-not-found.error';

/** Un solo flag activo/inactivo controla visibilidad pública y gestión admin — a diferencia de Teléfonos, este catálogo no pidió un paso de "publicar" separado. */
@Injectable()
export class SetCatalogProductActiveUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(id: string, isActive: boolean, userId: string): Promise<void> {
    const product = await this.catalogProductRepository.findById(id);
    if (!product) {
      throw new CatalogProductNotFoundError(id);
    }
    await this.catalogProductRepository.setActive(id, isActive, userId);
  }
}
