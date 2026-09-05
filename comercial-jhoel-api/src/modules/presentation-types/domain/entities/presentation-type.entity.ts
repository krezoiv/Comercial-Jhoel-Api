export interface PresentationTypeProps {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Catálogo maestro de tipos de presentación (Unidad, Caja, Paquete, ...) —
 * el nombre/código se administra aquí, una sola vez, y `product_presentations`
 * (módulo `inventory`) referencia una fila de este catálogo por FK en vez de
 * escribir el nombre como texto libre. El factor de conversión y los precios
 * de una presentación siguen viviendo en `product_presentations`, por
 * producto — este catálogo nunca los toca.
 */
export class PresentationType {
  private constructor(private readonly props: PresentationTypeProps) {}

  static create(props: PresentationTypeProps): PresentationType {
    return new PresentationType(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get code(): string | null {
    return this.props.code;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
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
