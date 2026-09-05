export interface InventoryStockProps {
  productId: string;
  locationId: string;
  locationName: string;
  quantity: number;
  /** `0` means "no threshold configured" — never alert for this row. See `modules/alerts/`'s own doc comment. */
  minStock: number;
  updatedAt: Date;
}

/** One row per (product, location), always in BASE UNITS — the granular source of truth. `products.stock` is kept in lockstep as the running total across every row for that product. */
export class InventoryStock {
  private constructor(private readonly props: InventoryStockProps) {}

  static create(props: InventoryStockProps): InventoryStock {
    return new InventoryStock(props);
  }

  get productId(): string {
    return this.props.productId;
  }

  get locationId(): string {
    return this.props.locationId;
  }

  get locationName(): string {
    return this.props.locationName;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get minStock(): number {
    return this.props.minStock;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
