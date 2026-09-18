import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankOutput, toCatalogBankOutput } from '../dtos/catalog-bank-output';

export interface CreateCatalogBankInput {
  name: string;
  description?: string;
  additionalInfo?: string;
  userId: string;
}

@Injectable()
export class CreateCatalogBankUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(input: CreateCatalogBankInput): Promise<CatalogBankOutput> {
    const bank = await this.catalogBankRepository.create({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      additionalInfo: input.additionalInfo?.trim() || null,
      createdBy: input.userId,
    });
    return toCatalogBankOutput(bank);
  }
}
