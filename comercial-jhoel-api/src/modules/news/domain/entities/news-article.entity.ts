export interface NewsArticleProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
  /** Leído en vivo del catálogo `news_types` — nunca copiado/desnormalizado en una escritura, mismo criterio que `CatalogProduct.categoryName`. */
  newsTypeName: string;
  isActive: boolean;
  sortOrder: number;
  likesCount: number;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Contenido editorial, no un producto — sin precio, sin categoría, sin
 * WhatsApp, sin Krediya. `description` es siempre texto plano (nunca HTML
 * enriquecido): Angular interpola texto de forma segura por defecto, así
 * que esta entidad es inmune a XSS por diseño, no por sanitización.
 */
export class NewsArticle {
  private constructor(private readonly props: NewsArticleProps) {}

  static create(props: NewsArticleProps): NewsArticle {
    return new NewsArticle(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string {
    return this.props.description;
  }

  get publishedAt(): string {
    return this.props.publishedAt;
  }

  get newsTypeId(): string {
    return this.props.newsTypeId;
  }

  get newsTypeName(): string {
    return this.props.newsTypeName;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get likesCount(): number {
    return this.props.likesCount;
  }

  get hasImage(): boolean {
    return this.props.hasImage;
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
