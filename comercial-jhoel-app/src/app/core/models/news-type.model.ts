/** Ficha admin — catálogo configurable "Tipos de Noticias" (Sistema → Tipos de Noticias). */
export interface NewsType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  /** Solo la fila semilla "Comercial" lo tiene — nunca editable desde el admin. */
  isWildcard: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
  usageCount: number;
}

export interface CreateNewsTypeInput {
  name: string;
  description?: string;
}

export interface UpdateNewsTypeInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}

/** Shape público mínimo — backs el formulario de suscripción y el selector "Tipo de noticia". */
export interface PublicNewsType {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}
