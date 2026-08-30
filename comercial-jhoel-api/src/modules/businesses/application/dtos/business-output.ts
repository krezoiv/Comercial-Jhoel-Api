import { Business } from '../../domain/entities/business.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface BusinessOutput {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toBusinessOutput(business: Business): BusinessOutput {
  return {
    id: business.id,
    name: business.name,
    description: business.description,
    isActive: business.isActive,
    createdAt: business.createdAt,
    updatedAt: business.updatedAt,
  };
}
