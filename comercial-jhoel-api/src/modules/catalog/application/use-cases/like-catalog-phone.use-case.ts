import { Inject, Injectable } from '@nestjs/common';
import { CATALOG_PHONE_REPOSITORY } from '../../domain/repositories/catalog-phone.repository';
import type { CatalogPhoneRepository } from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneNotPublishedError } from '../../domain/errors/catalog-phone-not-published.error';
import { CATALOG_LIKE_REPOSITORY } from '../../../likes/domain/repositories/catalog-like.repository';
import type {
  CatalogLikeAction,
  CatalogLikeRepository,
} from '../../../likes/domain/repositories/catalog-like.repository';

/**
 * "Me gusta" público — el conteo real y el anti-duplicado por visitante
 * viven en `catalog_likes` (ver `CatalogLikeRepository`), nunca en un
 * contador confiado del frontend. `LIKE` solo procede sobre teléfonos
 * publicados y activos (mismo criterio que
 * `GetPublishedCatalogPhoneByIdUseCase`); `UNLIKE` no exige esa visibilidad
 * — un visitante siempre puede deshacer su propio like aunque el teléfono
 * ya no esté publicado, y los likes históricos nunca se borran al
 * despublicar/desactivar.
 */
@Injectable()
export class LikeCatalogPhoneUseCase {
  constructor(
    @Inject(CATALOG_PHONE_REPOSITORY)
    private readonly catalogPhoneRepository: CatalogPhoneRepository,
    @Inject(CATALOG_LIKE_REPOSITORY)
    private readonly catalogLikeRepository: CatalogLikeRepository,
  ) {}

  async execute(
    id: string,
    visitorId: string,
    action: CatalogLikeAction,
  ): Promise<{ likesCount: number; liked: boolean }> {
    if (action === 'LIKE') {
      const phone = await this.catalogPhoneRepository.findById(id);
      if (!phone || !phone.isPublished || !phone.isActive) {
        throw new CatalogPhoneNotPublishedError();
      }
      await this.catalogLikeRepository.like('PHONE', id, visitorId);
    } else {
      await this.catalogLikeRepository.unlike('PHONE', id, visitorId);
    }
    const likesCount = await this.catalogLikeRepository.getCount('PHONE', id);
    return { likesCount, liked: action === 'LIKE' };
  }
}
