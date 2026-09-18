import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';
import { CatalogBankOutput, toCatalogBankOutput } from '../dtos/catalog-bank-output';

export interface UpdateCatalogBankInput {
  name?: string;
  description?: string;
  additionalInfo?: string;
  userId: string;
}

@Injectable()
export class UpdateCatalogBankUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string, input: UpdateCatalogBankInput): Promise<CatalogBankOutput> {
    const existing = await this.catalogBankRepository.findById(id);
    if (!existing) {
      throw new CatalogBankNotFoundError(id);
    }

    const updated = await this.catalogBankRepository.update(id, {
      name: input.name?.trim(),
      description: input.description?.trim(),
      additionalInfo: input.additionalInfo?.trim(),
      updatedBy: input.userId,
    });
    return toCatalogBankOutput(updated);
  }
}
