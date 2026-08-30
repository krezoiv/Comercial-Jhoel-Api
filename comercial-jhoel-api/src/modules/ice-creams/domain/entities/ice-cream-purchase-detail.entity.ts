export interface IceCreamPurchaseDetailProps {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
}

/** A frozen line item — `costPrice`/`total` are the values recorded at the moment of purchase, never recomputed from the live helado. */
export class IceCreamPurchaseDetail {
  private constructor(private readonly props: IceCreamPurchaseDetailProps) {}

  static create(props: IceCreamPurchaseDetailProps): IceCreamPurchaseDetail {
    return new IceCreamPurchaseDetail(props);
  }

  get id(): string {
    return this.props.id;
  }

  get iceCreamId(): string {
    return this.props.iceCreamId;
  }

  get product(): string {
    return this.props.product;
  }

  get sku(): string {
    return this.props.sku;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get total(): number {
    return this.props.total;
  }
}
