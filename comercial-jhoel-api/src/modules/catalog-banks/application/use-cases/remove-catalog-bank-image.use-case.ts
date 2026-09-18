import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';

@Injectable()
export class RemoveCatalogBankImageUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const bank = await this.catalogBankRepository.findById(id);
    if (!bank) {
      throw new CatalogBankNotFoundError(id);
    }
    await this.catalogBankRepository.removeImage(id, userId);
  }
}
