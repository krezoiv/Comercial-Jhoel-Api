export interface IceCreamProps {
  id: string;
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class IceCream {
  private constructor(private readonly props: IceCreamProps) {}

  static create(props: IceCreamProps): IceCream {
    return new IceCream(props);
  }

  get id(): string {
    return this.props.id;
  }

  get sku(): string {
    return this.props.sku;
  }

  get product(): string {
    return this.props.product;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get stock(): number {
    return this.props.stock;
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
