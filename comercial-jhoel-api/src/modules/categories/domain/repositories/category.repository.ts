import { Category } from '../entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');

export interface CreateCategoryData {
  name: string;
  description: string | null;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string | null;
}

export interface CategoryRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  /** Case-insensitive — among active rows only. Backs name-based lookups (e.g. the Excel bulk-import) where a caller has a human-typed name, not an id. */
  findByActiveName(name: string): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: string, data: UpdateCategoryData): Promise<Category>;
  deactivate(id: string): Promise<void>;
}
