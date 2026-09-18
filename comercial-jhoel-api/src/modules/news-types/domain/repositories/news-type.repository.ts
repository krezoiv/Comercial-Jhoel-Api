import { NewsType, NewsTypeProps } from '../entities/news-type.entity';

export const NEWS_TYPE_REPOSITORY = Symbol('NEWS_TYPE_REPOSITORY');

export interface FindNewsTypesOptions {
  activeOnly: boolean;
  search?: string;
}

export interface CreateNewsTypeData {
  name: string;
  slug: string;
  description: string | null;
  createdBy: string;
}

export interface UpdateNewsTypeData {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

export interface ReorderNewsTypeItem {
  id: string;
  sortOrder: number;
}

/** Una fila de listado más su uso real — nunca persistido, siempre calculado en vivo contra `news_articles`, igual que `PresentationTypeListItem`. */
export interface NewsTypeListItem extends NewsTypeProps {
  usageCount: number;
}

export interface NewsTypeRepository {
  findAll(options: FindNewsTypesOptions): Promise<NewsTypeListItem[]>;
  findById(id: string): Promise<NewsType | null>;
  /** Case-insensitive, recortado — solo entre filas activas (chequeo de "ya existe activo" al crear). */
  findByActiveName(name: string): Promise<NewsType | null>;
  /** Case-insensitive, recortado — cualquier estado (respalda el flujo de "ya existe pero está inactiva, ¿reactivar?"). */
  findByName(name: string): Promise<NewsType | null>;
  findBySlug(slug: string): Promise<NewsType | null>;
  /** El wildcard vigente ("Comercial") — nunca más de una fila con `is_wildcard = true`. */
  findWildcard(): Promise<NewsType | null>;
  create(data: CreateNewsTypeData): Promise<NewsType>;
  update(id: string, data: UpdateNewsTypeData): Promise<NewsType>;
  deactivate(id: string): Promise<void>;
  reorder(items: ReorderNewsTypeItem[]): Promise<void>;
  /** Noticias que actualmente referencian este tipo — solo para advertir antes de desactivar, nunca para bloquearlo. */
  countUsage(id: string): Promise<number>;
}
