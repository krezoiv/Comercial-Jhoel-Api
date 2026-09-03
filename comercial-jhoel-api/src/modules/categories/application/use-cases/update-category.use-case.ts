import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryOutput, toCategoryOutput } from '../dtos/category-output';

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateCategoryInput,
  ): Promise<CategoryOutput> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    // Only re-checks uniqueness when the name actually changed — saving a
    // category with its own unchanged name must never trip a false
    // "already exists" against itself.
    if (name && name !== category.name) {
      const existing = await this.categoryRepository.findByName(name);
      if (existing) {
        throw new CategoryNameAlreadyExistsError(name);
      }
    }

    const updated = await this.categoryRepository.update(id, {
      ...(name ? { name } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
    });
    return toCategoryOutput(updated);
  }
}
