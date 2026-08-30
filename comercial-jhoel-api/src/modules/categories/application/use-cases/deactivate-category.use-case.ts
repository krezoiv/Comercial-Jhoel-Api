import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository';
import type { CategoryRepository } from '../../domain/repositories/category.repository';
import { CategoryNotFoundError } from '../../domain/errors/category-not-found.error';

/**
 * Soft delete only — a category is never physically removed. Deactivating it
 * doesn't touch products that reference it (referential integrity is never at
 * risk); it just drops out of `findAll({ activeOnly: true })`, the same
 * pattern products use.
 */
@Injectable()
export class DeactivateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new CategoryNotFoundError(id);
    }
    await this.categoryRepository.deactivate(id);
  }
}
