export interface NewsArticleProps {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  isActive: boolean;
  sortOrder: number;
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

  get description(): string {
    return this.props.description;
  }

  get publishedAt(): string {
    return this.props.publishedAt;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
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
