import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { NewsTypeNotFoundError } from '../../domain/errors/news-type-not-found.error';
import { NewsTypeNameAlreadyExistsError } from '../../domain/errors/news-type-name-already-exists.error';
import { NewsTypeOutput, toNewsTypeOutput } from '../dtos/news-type-output';

export interface UpdateNewsTypeInput {
  name?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

/** `isActive` se puede alternar en ambos sentidos aquí (reactivación incluida) — mismo criterio que `UpdatePresentationTypeUseCase`. El `slug` nunca se regenera al editar (una vez asignado, es estable). */
@Injectable()
export class UpdateNewsTypeUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(id: string, input: UpdateNewsTypeInput): Promise<NewsTypeOutput> {
    const newsType = await this.newsTypeRepository.findById(id);
    if (!newsType) {
      throw new NewsTypeNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name.toLowerCase() !== newsType.name.toLowerCase()) {
      const existing = await this.newsTypeRepository.findByName(name);
      if (existing) {
        throw new NewsTypeNameAlreadyExistsError(name, !existing.isActive);
      }
    }

    const description =
      input.description !== undefined ? input.description?.trim().replace(/\s+/g, ' ') || null : undefined;

    const updated = await this.newsTypeRepository.update(id, {
      ...(name ? { name } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      updatedBy: input.updatedBy,
    });

    return toNewsTypeOutput(updated);
  }
}
