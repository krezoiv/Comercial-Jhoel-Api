import { IceCreamSaleDetail } from './ice-cream-sale-detail.entity';

export interface IceCreamSaleProps {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  items: IceCreamSaleDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export class IceCreamSale {
  private constructor(private readonly props: IceCreamSaleProps) {}

  static create(props: IceCreamSaleProps): IceCreamSale {
    return new IceCreamSale(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get saleDate(): Date {
    return this.props.saleDate;
  }

  get total(): number {
    return this.props.total;
  }

  get items(): IceCreamSaleDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
