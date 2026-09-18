import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotVisibleError } from '../../domain/errors/catalog-bank-not-visible.error';
import { PublicCatalogBankOutput, toPublicCatalogBankOutput } from '../dtos/catalog-bank-output';

/** 404 tanto si no existe como si existe pero está inactivo — nunca revela cuál. */
@Injectable()
export class GetPublishedCatalogBankByIdUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string): Promise<PublicCatalogBankOutput> {
    const bank = await this.catalogBankRepository.findById(id);
    if (!bank || !bank.isActive) {
      throw new CatalogBankNotVisibleError();
    }
    return toPublicCatalogBankOutput(bank);
  }
}
