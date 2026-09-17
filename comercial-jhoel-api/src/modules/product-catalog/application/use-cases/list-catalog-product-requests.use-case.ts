import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-product-request.repository';
import type {
  CatalogProductRequestRepository,
  ListCatalogProductRequestsOptions,
} from '../../domain/repositories/catalog-product-request.repository';
import {
  CatalogProductRequestOutput,
  toCatalogProductRequestOutput,
} from '../dtos/catalog-product-request-output';

@Injectable()
export class ListCatalogProductRequestsUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY)
    private readonly catalogProductRequestRepository: CatalogProductRequestRepository,
  ) {}

  async execute(
    options?: ListCatalogProductRequestsOptions,
  ): Promise<CatalogProductRequestOutput[]> {
    const requests = await this.catalogProductRequestRepository.findAll(options);
    return requests.map(toCatalogProductRequestOutput);
  }
}
