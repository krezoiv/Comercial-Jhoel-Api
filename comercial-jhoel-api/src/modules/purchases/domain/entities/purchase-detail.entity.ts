export interface PurchaseDetailProps {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  total: number;
}

/** A frozen line item — `costPrice`/`publicPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live product. */
export class PurchaseDetail {
  private constructor(private readonly props: PurchaseDetailProps) {}

  static create(props: PurchaseDetailProps): PurchaseDetail {
    return new PurchaseDetail(props);
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

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get total(): number {
    return this.props.total;
  }
}
