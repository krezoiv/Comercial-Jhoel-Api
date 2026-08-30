export interface RechargeSaleProps {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  dailyBalanceId: string;
  phoneNumber: string;
  amount: number;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  date: string;
  /** Whether the cycle this sale was recorded under is still open — mirrors the referenced daily-balance row's `finalBalance === null`. Once locked, neither `update` nor `delete` is allowed. */
  locked: boolean;
  createdByUserId: string;
  createdByUsername: string;
  updatedByUserId: string | null;
  updatedByUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * One individually-sold recharge (a customer's top-up) — the counterpart to
 * `RechargeDailyBalance`'s purchase side. Kept forever for audit/history;
 * `dailyBalanceId` ties it to the exact cuadre cycle it was recorded under,
 * which is also what makes `locked` derivable rather than a separately
 * tracked flag (see the migration's own comment).
 */
export class RechargeSale {
  private constructor(private readonly props: RechargeSaleProps) {}

  static create(props: RechargeSaleProps): RechargeSale {
    return new RechargeSale(props);
  }

  get id(): string {
    return this.props.id;
  }

  get rechargeTypeId(): string {
    return this.props.rechargeTypeId;
  }

  get rechargeTypeName(): string {
    return this.props.rechargeTypeName;
  }

  get dailyBalanceId(): string {
    return this.props.dailyBalanceId;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get amount(): number {
    return this.props.amount;
  }

  get date(): string {
    return this.props.date;
  }

  get locked(): boolean {
    return this.props.locked;
  }

  get createdByUserId(): string {
    return this.props.createdByUserId;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get updatedByUserId(): string | null {
    return this.props.updatedByUserId;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
