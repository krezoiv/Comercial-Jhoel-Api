import { NewsType } from '../../domain/entities/news-type.entity';
import { NewsTypeListItem } from '../../domain/repositories/news-type.repository';

export interface NewsTypeOutput {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isWildcard: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface NewsTypeListOutput extends NewsTypeOutput {
  usageCount: number;
}

/** Shape público mínimo — backs el formulario de suscripción y el selector "Tipo de noticia" del form admin sin exponer auditoría. */
export interface PublicNewsTypeOutput {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}

export function toNewsTypeOutput(newsType: NewsType): NewsTypeOutput {
  return {
    id: newsType.id,
    name: newsType.name,
    slug: newsType.slug,
    description: newsType.description,
    isWildcard: newsType.isWildcard,
    isActive: newsType.isActive,
    sortOrder: newsType.sortOrder,
    createdAt: newsType.createdAt,
    updatedAt: newsType.updatedAt,
    createdBy: newsType.createdBy,
    createdByUsername: newsType.createdByUsername,
    updatedBy: newsType.updatedBy,
    updatedByUsername: newsType.updatedByUsername,
  };
}

export function toNewsTypeListOutput(item: NewsTypeListItem): NewsTypeListOutput {
  return { ...item, usageCount: item.usageCount };
}

export function toPublicNewsTypeOutput(newsType: NewsTypeListItem): PublicNewsTypeOutput {
  return { id: newsType.id, name: newsType.name, slug: newsType.slug, isWildcard: newsType.isWildcard };
}
