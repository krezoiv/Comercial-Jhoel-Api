import { PurchaseDetail } from './purchase-detail.entity';

export type PurchasePaymentType = 'CONTADO' | 'CREDITO';
export type PurchasePaymentStatus = 'PENDING' | 'PAID';

export interface PurchaseProps {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: PurchaseDetail[];
  createdAt: Date;
  updatedAt: Date;
  paymentType: PurchasePaymentType;
  /** `yyyy-MM-dd` — a calendar due date, not a timestamp. Always `null` for CONTADO. */
  paymentDueDate: string | null;
  paymentStatus: PurchasePaymentStatus;
  paidAt: Date | null;
  paidBy: string | null;
  paidByUsername: string | null;
}

export class Purchase {
  private constructor(private readonly props: PurchaseProps) {}

  static create(props: PurchaseProps): Purchase {
    return new Purchase(props);
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

  get items(): PurchaseDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get paymentType(): PurchasePaymentType {
    return this.props.paymentType;
  }

  get paymentDueDate(): string | null {
    return this.props.paymentDueDate;
  }

  get paymentStatus(): PurchasePaymentStatus {
    return this.props.paymentStatus;
  }

  get paidAt(): Date | null {
    return this.props.paidAt;
  }

  get paidBy(): string | null {
    return this.props.paidBy;
  }

  get paidByUsername(): string | null {
    return this.props.paidByUsername;
  }
}
