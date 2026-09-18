export interface NewsTypeProps {
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

/**
 * Catálogo maestro y configurable de clasificaciones de noticias (Comercial,
 * Educativa, Promociones, ...) — extensible desde el admin sin tocar
 * código. `isWildcard` es el mecanismo central de "Comercial = recibe
 * todas las noticias" (ver `CreateNewsNotificationsForArticleUseCase`),
 * puesto en `true` únicamente por la migración semilla de "Comercial" —
 * nunca expuesto para editar desde ningún endpoint, es una decisión
 * arquitectónica fija sobre esa categoría inicial, no una feature general.
 */
export class NewsType {
  private constructor(private readonly props: NewsTypeProps) {}

  static create(props: NewsTypeProps): NewsType {
    return new NewsType(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isWildcard(): boolean {
    return this.props.isWildcard;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
