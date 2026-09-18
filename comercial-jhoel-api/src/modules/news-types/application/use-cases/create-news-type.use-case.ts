import { Inject, Injectable } from '@nestjs/common';
import { NEWS_TYPE_REPOSITORY } from '../../domain/repositories/news-type.repository';
import type { NewsTypeRepository } from '../../domain/repositories/news-type.repository';
import { NewsTypeNameAlreadyExistsError } from '../../domain/errors/news-type-name-already-exists.error';
import { slugify } from '../utils/slugify';
import { NewsTypeOutput, toNewsTypeOutput } from '../dtos/news-type-output';

export interface CreateNewsTypeInput {
  name: string;
  description?: string;
  createdBy: string;
}

/**
 * El frontend consulta `GET /news-types?includeInactive=true` antes de
 * llamar aquí y ofrece "Activar" en vez de "Crear" cuando ya existe una
 * fila inactiva con ese nombre (mismo criterio ya establecido por
 * `CreatePresentationTypeUseCase`) — esta capa igual rechaza un duplicado
 * inactivo en vez de reactivarlo silenciosamente, para que una llamada
 * directa a la API sin pasar por esa UX reciba un error claro y seguro.
 *
 * `is_wildcard` nunca se acepta aquí — solo la fila semilla "Comercial"
 * lo tiene, puesto por la migración.
 */
@Injectable()
export class CreateNewsTypeUseCase {
  constructor(
    @Inject(NEWS_TYPE_REPOSITORY)
    private readonly newsTypeRepository: NewsTypeRepository,
  ) {}

  async execute(input: CreateNewsTypeInput): Promise<NewsTypeOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');
    const description = input.description?.trim().replace(/\s+/g, ' ') || null;

    const existingByName = await this.newsTypeRepository.findByName(name);
    if (existingByName) {
      throw new NewsTypeNameAlreadyExistsError(name, !existingByName.isActive);
    }

    const slug = await this.generateUniqueSlug(name);

    const newsType = await this.newsTypeRepository.create({
      name,
      slug,
      description,
      createdBy: input.createdBy,
    });

    return toNewsTypeOutput(newsType);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name) || 'tipo';
    let candidate = base;
    let suffix = 2;
    while (await this.newsTypeRepository.findBySlug(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }
}
