export interface CatalogBankProps {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
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
 * Catálogo público informativo de bancos — imagen, nombre, descripción,
 * información adicional. Completamente independiente del módulo
 * financiero "Bancos" (`modules/banks/`, saldos de Cuadre de Agentes) —
 * esta entidad nunca referencia esa tabla ni sus datos. Mismo criterio que
 * `NewsArticle`: contenido editorial autónomo, sin FK a otra entidad de
 * negocio.
 */
export class CatalogBank {
  private constructor(private readonly props: CatalogBankProps) {}

  static create(props: CatalogBankProps): CatalogBank {
    return new CatalogBank(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get additionalInfo(): string | null {
    return this.props.additionalInfo;
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
