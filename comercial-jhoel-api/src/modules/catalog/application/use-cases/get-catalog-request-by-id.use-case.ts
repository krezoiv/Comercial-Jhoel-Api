import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-request.repository';
import type { CatalogRequestRepository } from '../../domain/repositories/catalog-request.repository';
import { CatalogRequestNotFoundError } from '../../domain/errors/catalog-request-not-found.error';
import {
  CatalogRequestOutput,
  toCatalogRequestOutput,
} from '../dtos/catalog-request-output';

@Injectable()
export class GetCatalogRequestByIdUseCase {
  constructor(
    @Inject(CATALOG_REQUEST_REPOSITORY)
    private readonly catalogRequestRepository: CatalogRequestRepository,
  ) {}

  async execute(id: string): Promise<CatalogRequestOutput> {
    const request = await this.catalogRequestRepository.findById(id);
    if (!request) {
      throw new CatalogRequestNotFoundError(id);
    }
    return toCatalogRequestOutput(request);
  }
}
