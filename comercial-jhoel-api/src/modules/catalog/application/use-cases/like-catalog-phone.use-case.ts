import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotPublishedError } from '../../domain/errors/catalog-phone-not-published.error';

/**
 * "Me gusta" público — solo sobre teléfonos publicados y activos (mismo
 * criterio que `GetPublishedCatalogPhoneByIdUseCase`). `delta` es siempre
 * `+1`/`-1`, nunca un valor arbitrario del cliente — el toggle like/unlike
 * lo decide el frontend, pero el conteo real y el piso de 0 los garantiza
 * siempre `adjustLikes` en el repositorio, atómicamente.
 */
@Injectable()
export class LikeCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
  ) {}

  async execute(id: string, delta: 1 | -1): Promise<{ likesCount: number }> {
    const phone = await this.catalogPhoneRepository.findById(id);
    if (!phone || !phone.isPublished || !phone.isActive) {
      throw new CatalogPhoneNotPublishedError();
    }
    const likesCount = await this.catalogPhoneRepository.adjustLikes(id, delta);
    return { likesCount };
  }
}
