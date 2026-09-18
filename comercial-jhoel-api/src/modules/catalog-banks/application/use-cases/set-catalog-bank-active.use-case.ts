import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_BANK_REPOSITORY } from '../../domain/repositories/catalog-bank.repository';
import type { CatalogBankRepository } from '../../domain/repositories/catalog-bank.repository';
import { CatalogBankNotFoundError } from '../../domain/errors/catalog-bank-not-found.error';

/** Soft — nunca DELETE físico. Un banco desactivado desaparece del catálogo público pero conserva imagen/descripción/historial en administración. */
@Injectable()
export class SetCatalogBankActiveUseCase {
  constructor(
    @Inject(CATALOG_BANK_REPOSITORY)
    private readonly catalogBankRepository: CatalogBankRepository,
  ) {}

  async execute(id: string, isActive: boolean, userId: string): Promise<void> {
    const bank = await this.catalogBankRepository.findById(id);
    if (!bank) {
      throw new CatalogBankNotFoundError(id);
    }
    await this.catalogBankRepository.setActive(id, isActive, userId);
  }
}
