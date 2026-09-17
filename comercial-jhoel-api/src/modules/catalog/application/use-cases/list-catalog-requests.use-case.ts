import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-request.repository';
import type {
  CatalogRequestRepository,
  ListCatalogRequestsOptions,
} from '../../domain/repositories/catalog-request.repository';
import {
  CatalogRequestOutput,
  toCatalogRequestOutput,
} from '../dtos/catalog-request-output';

@Injectable()
export class ListCatalogRequestsUseCase {
  constructor(
    @Inject(CATALOG_REQUEST_REPOSITORY)
    private readonly catalogRequestRepository: CatalogRequestRepository,
  ) {}

  async execute(
    options?: ListCatalogRequestsOptions,
  ): Promise<CatalogRequestOutput[]> {
    const requests = await this.catalogRequestRepository.findAll(options);
    return requests.map(toCatalogRequestOutput);
  }
}
