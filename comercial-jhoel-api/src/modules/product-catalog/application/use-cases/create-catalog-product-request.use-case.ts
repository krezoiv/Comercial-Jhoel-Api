import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REPOSITORY } from '../../domain/repositories/catalog-product.repository';
import type { CatalogProductRepository } from '../../domain/repositories/catalog-product.repository';
import { CATALOG_PRODUCT_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-product-request.repository';
import type { CatalogProductRequestRepository } from '../../domain/repositories/catalog-product-request.repository';
import { CatalogProductNotVisibleError } from '../../domain/errors/catalog-product-not-visible.error';
import { CatalogProductRequestNotAllowedError } from '../../domain/errors/catalog-product-request-not-allowed.error';
import {
  CatalogProductRequestOutput,
  toCatalogProductRequestOutput,
} from '../dtos/catalog-product-request-output';

export interface CreateCatalogProductRequestInput {
  catalogProductId: string;
  customerName: string;
  customerPhone: string;
}

/**
 * "Lo quiero" para Variedades y Accesorios — el punto más sensible de este
 * módulo. Nunca confía en nada del cliente salvo nombre/teléfono (el DTO
 * ni siquiera tiene un campo de precio/nombre de producto — ver
 * `CreateCatalogProductRequestRequestDto`); el nombre/precio se releen de
 * la publicación real y se congelan como snapshot. Rechaza explícitamente
 * cualquier intento contra una publicación de sección `LIBRERIA` — esa
 * sección es puramente informativa, nunca genera solicitudes. Deliberada-
 * mente SIN nada de Krediya (Krediya es exclusiva de Teléfonos).
 */
@Injectable()
export class CreateCatalogProductRequestUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REPOSITORY)
    private readonly catalogProductRepository: CatalogProductRepository,
    @Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY)
    private readonly catalogProductRequestRepository: CatalogProductRequestRepository,
  ) {}

  async execute(
    input: CreateCatalogProductRequestInput,
  ): Promise<CatalogProductRequestOutput> {
    const product = await this.catalogProductRepository.findById(input.catalogProductId);
    if (!product || !product.isPubliclyVisible) {
      throw new CatalogProductNotVisibleError();
    }
    if (product.section === 'LIBRERIA') {
      throw new CatalogProductRequestNotAllowedError();
    }

    const request = await this.catalogProductRequestRepository.create({
      catalogProductId: product.id,
      productName: product.productName,
      price: product.productPrice,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
    });

    return toCatalogProductRequestOutput(request);
  }
}
