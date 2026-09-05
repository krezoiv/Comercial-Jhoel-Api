export type InventoryMovementType =
  'ENTRADA_COMPRA' | 'SALIDA_VENTA' | 'TRASLADO_SALIDA' | 'TRASLADO_ENTRADA';

export interface InventoryMovementProps {
  id: string;
  productId: string;
  presentationId: string;
  presentationName: string;
  locationFromId: string | null;
  locationFromName: string | null;
  locationToId: string | null;
  locationToName: string | null;
  movementType: InventoryMovementType;
  quantityPresentation: number;
  conversionFactor: number;
  quantityBaseUnits: number;
  referenceType: string | null;
  referenceId: string | null;
  userId: string;
  username: string;
  reason: string | null;
  createdAt: Date;
}

/** Audit trail row for a CONFIRMED inventory-affecting operation (compra, venta confirmada, traslado) — never written for in-flight cart adjustments, so it always reflects real, final business events. */
export class InventoryMovement {
  private constructor(private readonly props: InventoryMovementProps) {}

  static create(props: InventoryMovementProps): InventoryMovement {
    return new InventoryMovement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get presentationName(): string {
    return this.props.presentationName;
  }

  get locationFromName(): string | null {
    return this.props.locationFromName;
  }

  get locationToName(): string | null {
    return this.props.locationToName;
  }

  get movementType(): InventoryMovementType {
    return this.props.movementType;
  }

  get quantityPresentation(): number {
    return this.props.quantityPresentation;
  }

  get conversionFactor(): number {
    return this.props.conversionFactor;
  }

  get quantityBaseUnits(): number {
    return this.props.quantityBaseUnits;
  }

  get referenceType(): string | null {
    return this.props.referenceType;
  }

  get referenceId(): string | null {
    return this.props.referenceId;
  }

  get username(): string {
    return this.props.username;
  }

  get reason(): string | null {
    return this.props.reason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
