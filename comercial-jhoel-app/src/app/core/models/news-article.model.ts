/** Ficha completa de administración — contenido editorial, no un producto. */
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
  newsTypeName: string;
  isActive: boolean;
  sortOrder: number;
  likesCount: number;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface CreateNewsArticleInput {
  title: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
}

export interface UpdateNewsArticleInput {
  title?: string;
  description?: string;
  publishedAt?: string;
  newsTypeId?: string;
}

/** Shape público — backs "Noticias" en la landing. Sin isActive/audit. */
export interface PublicNewsArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeName: string;
  hasImage: boolean;
  likesCount: number;
  /** Si este visitante (identificado por `getVisitorId()`) ya le dio like — viene siempre del backend, nunca de `localStorage`. */
  liked: boolean;
}
