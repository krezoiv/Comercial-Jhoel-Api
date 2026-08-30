import { Category } from '../../domain/entities/category.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface CategoryOutput {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toCategoryOutput(category: Category): CategoryOutput {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}
