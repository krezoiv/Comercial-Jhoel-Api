export interface RechargeSalesClosureProps {
  id: string;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  date: string;
  /** Which cuadre cycle of `date` this closure is for — see `RechargeDailyBalance.sequence`. */
  sequence: number;
  totalSales: number;
  totalCollected: number;
  result: number;
  createdByUserId: string;
  createdByUsername: string;
  updatedByUserId: string | null;
  updatedByUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * One row per calendar day — the daily cash reconciliation ("cuadre") across
 * every recharge type. Unlike `RechargeDailyBalance`'s `totalPurchases`/
 * `sale`, `totalSales`/`result` here ARE stored, not derived on read: a
 * closure is a frozen historical fact the moment it's saved, and must stay
 * exactly what it was even if a later admin correction to some type's
 * `finalBalance` would change what the *live* sales figures currently
 * compute to. Re-saving (an authorized edit) explicitly recomputes and
 * overwrites both — see `register_recharge_sales_closure`.
 */
export class RechargeSalesClosure {
  private constructor(private readonly props: RechargeSalesClosureProps) {}

  static create(props: RechargeSalesClosureProps): RechargeSalesClosure {
    return new RechargeSalesClosure(props);
  }

  get id(): string {
    return this.props.id;
  }

  get date(): string {
    return this.props.date;
  }

  get sequence(): number {
    return this.props.sequence;
  }

  get totalSales(): number {
    return this.props.totalSales;
  }

  get totalCollected(): number {
    return this.props.totalCollected;
  }

  get result(): number {
    return this.props.result;
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
