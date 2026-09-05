import { SaleDetail } from './sale-detail.entity';

export type SaleStatus = 'OPEN' | 'CONFIRMED';
export type PriceListType = 'PUBLIC' | 'WHOLESALE';

export interface SaleProps {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  status: SaleStatus;
  clientId: string | null;
  clientName: string | null;
  priceList: PriceListType;
  /** Opaque, client-generated id scoping "which open receipt" for a user with several open at once — `null` for a `CONFIRMED` sale, meaningless once a sale is real. */
  draftKey: string | null;
  items: SaleDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export class Sale {
  private constructor(private readonly props: SaleProps) {}

  static create(props: SaleProps): Sale {
    return new Sale(props);
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

  get status(): SaleStatus {
    return this.props.status;
  }

  get clientId(): string | null {
    return this.props.clientId;
  }

  get clientName(): string | null {
    return this.props.clientName;
  }

  get priceList(): PriceListType {
    return this.props.priceList;
  }

  get draftKey(): string | null {
    return this.props.draftKey;
  }

  get items(): SaleDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
