import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { PublicNewsTypeOutput, toPublicNewsTypeOutput } from '../dtos/news-type-output';

/** Backs el formulario público de suscripción — solo activas, shape mínimo (sin auditoría). */
@Injectable()
export class ListActiveNewsTypesUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(): Promise<PublicNewsTypeOutput[]> {
    const items = await this.newsTypeRepository.findAll({ activeOnly: true });
    return items.map(toPublicNewsTypeOutput);
  }
}
