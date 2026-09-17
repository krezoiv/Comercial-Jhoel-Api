import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-product-request.repository';
import type { CatalogProductRequestRepository } from '../../domain/repositories/catalog-product-request.repository';
import { CatalogProductRequestNotFoundError } from '../../domain/errors/catalog-product-request-not-found.error';
import {
  CatalogProductRequestOutput,
  toCatalogProductRequestOutput,
} from '../dtos/catalog-product-request-output';

@Injectable()
export class GetCatalogProductRequestByIdUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY)
    private readonly catalogProductRequestRepository: CatalogProductRequestRepository,
  ) {}

  async execute(id: string): Promise<CatalogProductRequestOutput> {
    const request = await this.catalogProductRequestRepository.findById(id);
    if (!request) {
      throw new CatalogProductRequestNotFoundError(id);
    }
    return toCatalogProductRequestOutput(request);
  }
}
