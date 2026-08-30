export interface IceCreamSaleDetailProps {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/** A frozen line item — `unitPrice`/`total` are the helado's public price at the moment of sale, never recomputed from the live helado. */
export class IceCreamSaleDetail {
  private constructor(private readonly props: IceCreamSaleDetailProps) {}

  static create(props: IceCreamSaleDetailProps): IceCreamSaleDetail {
    return new IceCreamSaleDetail(props);
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

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get total(): number {
    return this.props.total;
  }
}
