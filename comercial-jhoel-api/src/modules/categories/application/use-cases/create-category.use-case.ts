import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNameAlreadyExistsError } from '../../domain/errors/category-name-already-exists.error';
import { CategoryOutput, toCategoryOutput } from '../dtos/category-output';

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(input: CreateCategoryInput): Promise<CategoryOutput> {
    // Collapse incidental whitespace (leading/trailing, double spaces from
    // a copy-paste) before the uniqueness check — otherwise "Bebidas" and
    // "Bebidas " would be treated as different names here while the DB's
    // own unique index would still reject the second one anyway.
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing = await this.categoryRepository.findByName(name);
    if (existing) {
      throw new CategoryNameAlreadyExistsError(name);
    }

    const category = await this.categoryRepository.create({
      name,
      description: input.description?.trim() || null,
    });
    return toCategoryOutput(category);
  }
}
