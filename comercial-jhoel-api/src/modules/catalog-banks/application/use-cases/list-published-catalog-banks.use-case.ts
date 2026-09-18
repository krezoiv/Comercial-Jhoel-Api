import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { PublicCatalogBankOutput, toPublicCatalogBankOutput } from '../dtos/catalog-bank-output';

/** Backs la sección "Bancos" en la landing — solo `isActive`, ordenados por `sortOrder`, nunca datos del módulo financiero "Bancos". */
@Injectable()
export class ListPublishedCatalogBanksUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(): Promise<PublicCatalogBankOutput[]> {
    const banks = await this.catalogBankRepository.findPublished();
    return banks.map(toPublicCatalogBankOutput);
  }
}
