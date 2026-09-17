import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type {
  CatalogPhoneRepository,
  ReorderCatalogPhoneItem,
} from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';

/**
 * Admin-only, sequential, no expected concurrency — a plain transactional
 * bulk update is correct here, no stored function needed (same "no
 * construir un procedure donde un statement plano ya basta" convention
 * every simple CRUD module in this codebase already follows).
 */
@Injectable()
export class ReorderCatalogPhonesUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(items: ReorderCatalogPhoneItem[]): Promise<void> {
    for (const item of items) {
      const phone = await this.catalogPhoneRepository.findById(item.id);
      if (!phone) {
        throw new CatalogPhoneNotFoundError(item.id);
      }
    }
    await this.catalogPhoneRepository.reorder(items);
  }
}
