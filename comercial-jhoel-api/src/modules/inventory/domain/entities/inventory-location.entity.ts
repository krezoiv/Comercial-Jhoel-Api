export interface InventoryLocationProps {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Bodega/Vitrina today — a normalized, extensible list (mirrors `RechargeType`'s own lookup-table pattern) so a future location is a seeded row, never a code change. */
export class InventoryLocation {
  private constructor(private readonly props: InventoryLocationProps) {}

  static create(props: InventoryLocationProps): InventoryLocation {
    return new InventoryLocation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
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
}
