import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type {
  CatalogProductRepository,
  ListCatalogProductsOptions,
} from '../../domain/repositories/catalog-product.repository';
import { CatalogProductOutput, toCatalogProductOutput } from '../dtos/catalog-product-output';

/** Listado admin — una sección a la vez (Librería o Variedades), incluye inactivos opcionalmente. */
@Injectable()
export class ListCatalogProductsUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
  ) {}

  async execute(options: ListCatalogProductsOptions): Promise<CatalogProductOutput[]> {
    const products = await this.catalogProductRepository.findAll(options);
    return products.map(toCatalogProductOutput);
  }
}
