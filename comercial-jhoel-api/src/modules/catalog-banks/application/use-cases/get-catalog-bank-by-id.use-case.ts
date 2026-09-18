import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';
import { CatalogBankOutput, toCatalogBankOutput } from '../dtos/catalog-bank-output';

@Injectable()
export class GetCatalogBankByIdUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string): Promise<CatalogBankOutput> {
    const bank = await this.catalogBankRepository.findById(id);
    if (!bank) {
      throw new CatalogBankNotFoundError(id);
    }
    return toCatalogBankOutput(bank);
  }
}
