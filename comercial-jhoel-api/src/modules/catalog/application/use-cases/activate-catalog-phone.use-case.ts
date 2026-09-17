import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotFoundError } from '../../domain/errors/catalog-phone-not-found.error';

/** Reactivates a soft-deleted phone — never auto-publishes it (publishing stays its own explicit action, requiring at least one image). */
@Injectable()
export class ActivateCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const phone = await this.catalogPhoneRepository.findById(id);
    if (!phone) {
      throw new CatalogPhoneNotFoundError(id);
    }
    await this.catalogPhoneRepository.setActive(id, true, userId);
  }
}
