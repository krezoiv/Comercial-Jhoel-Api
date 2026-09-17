import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_REQUEST_REPOSITORY } from '../../domain/repositories/catalog-request.repository';
import type { CatalogRequestRepository } from '../../domain/repositories/catalog-request.repository';
import { CatalogRequestNotFoundError } from '../../domain/errors/catalog-request-not-found.error';
import { CatalogRequestStatus } from '../../domain/entities/catalog-request.entity';
import {
  CatalogRequestOutput,
  toCatalogRequestOutput,
} from '../dtos/catalog-request-output';

export interface UpdateCatalogRequestStatusInput {
  status: CatalogRequestStatus;
  observation?: string | null;
  userId: string;
}

/** Marca atendida / contactada / en proceso / cancelada, con observación libre — la campana de alertas deja de contar esta fila en cuanto deja de estar en `NUEVA`. */
@Injectable()
export class UpdateCatalogRequestStatusUseCase {
  constructor(
    @Inject(CATALOG_REQUEST_REPOSITORY)
    private readonly catalogRequestRepository: CatalogRequestRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCatalogRequestStatusInput,
  ): Promise<CatalogRequestOutput> {
    const existing = await this.catalogRequestRepository.findById(id);
    if (!existing) {
      throw new CatalogRequestNotFoundError(id);
    }
    const updated = await this.catalogRequestRepository.updateStatus(id, {
      status: input.status,
      observation: input.observation,
      updatedBy: input.userId,
    });
    return toCatalogRequestOutput(updated);
  }
}
