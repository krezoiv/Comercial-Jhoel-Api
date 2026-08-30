import { IceCreamPurchaseDetail } from './ice-cream-purchase-detail.entity';

export interface IceCreamPurchaseProps {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: IceCreamPurchaseDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export class IceCreamPurchase {
  private constructor(private readonly props: IceCreamPurchaseProps) {}

  static create(props: IceCreamPurchaseProps): IceCreamPurchase {
    return new IceCreamPurchase(props);
  }

  get id(): string {
    return this.props.id;
  }

  get supplierId(): string {
    return this.props.supplierId;
  }

  get supplierName(): string {
    return this.props.supplierName;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get purchaseDate(): Date {
    return this.props.purchaseDate;
  }

  get total(): number {
    return this.props.total;
  }

  get items(): IceCreamPurchaseDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
