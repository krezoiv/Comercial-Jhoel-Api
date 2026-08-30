export interface SaleDetailProps {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** A frozen line item — `unitPrice`/`total` are the values at the moment of sale, never recomputed from the live product. */
export class SaleDetail {
  private constructor(private readonly props: SaleDetailProps) {}

  static create(props: SaleDetailProps): SaleDetail {
    return new SaleDetail(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get productName(): string {
    return this.props.productName;
  }

  get sku(): string | null {
    return this.props.sku;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get total(): number {
    return this.props.total;
  }
}
