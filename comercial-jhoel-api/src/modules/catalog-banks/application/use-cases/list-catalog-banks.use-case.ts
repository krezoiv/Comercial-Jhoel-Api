import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankOutput, toCatalogBankOutput } from '../dtos/catalog-bank-output';

export interface ListCatalogBanksInput {
  includeInactive?: boolean;
  search?: string;
}

@Injectable()
export class ListCatalogBanksUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(input: ListCatalogBanksInput = {}): Promise<CatalogBankOutput[]> {
    const banks = await this.catalogBankRepository.findAll(input);
    return banks.map(toCatalogBankOutput);
  }
}
