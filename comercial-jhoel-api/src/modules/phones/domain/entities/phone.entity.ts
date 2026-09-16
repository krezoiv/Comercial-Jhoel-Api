export type PhoneOperator = 'CLARO' | 'TIGO';
export type PhoneStatus = 'DISPONIBLE' | 'VENDIDO';

export interface PhoneProps {
  id: string;
  operator: PhoneOperator;
  phoneNumber: string;
  imei: string;
  costPrice: number;
  publicPrice: number;
  status: PhoneStatus;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  purchaseDate: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * One individually-identified physical phone unit — never a generic
 * `products` row with a numeric stock (an explicit requirement for this
 * module). `status` starts `DISPONIBLE` and only ever changes via
 * `register_phone_sale`/`void_phone_sale` (see the migration's own doc
 * comment) — never set directly by application code.
 */
export class Phone {
  private constructor(private readonly props: PhoneProps) {}

  static create(props: PhoneProps): Phone {
    return new Phone(props);
  }

  get id(): string {
    return this.props.id;
  }

  get operator(): PhoneOperator {
    return this.props.operator;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get imei(): string {
    return this.props.imei;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
  }

  get status(): PhoneStatus {
    return this.props.status;
  }

  get purchaseDate(): string {
    return this.props.purchaseDate;
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
