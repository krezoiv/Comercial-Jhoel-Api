import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PRODUCT_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-product-request.repository';
import type { CatalogProductRequestRepository } from '../../domain/repositories/catalog-product-request.repository';
import { CatalogProductRequestNotFoundError } from '../../domain/errors/catalog-product-request-not-found.error';
import { CatalogProductRequestStatus } from '../../domain/entities/catalog-product-request.entity';
import {
  CatalogProductRequestOutput,
  toCatalogProductRequestOutput,
} from '../dtos/catalog-product-request-output';

export interface UpdateCatalogProductRequestStatusInput {
  status: CatalogProductRequestStatus;
  observation?: string | null;
  userId: string;
}

@Injectable()
export class UpdateCatalogProductRequestStatusUseCase {
  constructor(
    @Inject(CATALOG_PRODUCT_REQUEST_REPOSITORY)
    private readonly catalogProductRequestRepository: CatalogProductRequestRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCatalogProductRequestStatusInput,
  ): Promise<CatalogProductRequestOutput> {
    const existing = await this.catalogProductRequestRepository.findById(id);
    if (!existing) {
      throw new CatalogProductRequestNotFoundError(id);
    }
    const updated = await this.catalogProductRequestRepository.updateStatus(id, {
      status: input.status,
      observation: input.observation,
      updatedBy: input.userId,
    });
    return toCatalogProductRequestOutput(updated);
  }
}
