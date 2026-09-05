export interface UnitOfMeasureProps {
  id: string;
  name: string;
  abbreviation: string;
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
 * Catálogo maestro de unidades de medida (Unidad, Kilogramo, Litro, ...) —
 * un concepto deliberadamente separado de `PresentationType` (Caja,
 * Paquete...): esto describe la unidad física en la que se mide un
 * producto, no cómo se agrupa/comercializa. `products.unit_of_measure_id`
 * referencia una fila de este catálogo por FK — un producto tiene
 * exactamente una unidad de medida, a diferencia de sus múltiples
 * presentaciones.
 */
export class UnitOfMeasure {
  private constructor(private readonly props: UnitOfMeasureProps) {}

  static create(props: UnitOfMeasureProps): UnitOfMeasure {
    return new UnitOfMeasure(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get abbreviation(): string {
    return this.props.abbreviation;
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
