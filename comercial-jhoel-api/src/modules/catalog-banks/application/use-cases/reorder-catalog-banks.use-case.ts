import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository, ReorderCatalogBankItem } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';

@Injectable()
export class ReorderCatalogBanksUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(items: ReorderCatalogBankItem[]): Promise<void> {
    for (const item of items) {
      const bank = await this.catalogBankRepository.findById(item.id);
      if (!bank) {
        throw new CatalogBankNotFoundError(item.id);
      }
    }
    await this.catalogBankRepository.reorder(items);
  }
}
