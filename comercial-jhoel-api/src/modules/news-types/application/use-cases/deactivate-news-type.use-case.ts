import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { NewsTypeNotFoundError } from '../../domain/errors/news-type-not-found.error';

/**
 * Soft delete — nunca físico. No bloquea sobre `usageCount > 0`: las
 * noticias/suscripciones ya existentes conservan su relación histórica; un
 * tipo inactivo solo deja de ofrecerse para NUEVAS noticias/suscripciones
 * (filtrado en las consultas correspondientes), igual que
 * `DeactivatePresentationTypeUseCase`.
 */
@Injectable()
export class DeactivateNewsTypeUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const newsType = await this.newsTypeRepository.findById(id);
    if (!newsType) {
      throw new NewsTypeNotFoundError(id);
    }
    await this.newsTypeRepository.deactivate(id);
  }
}
