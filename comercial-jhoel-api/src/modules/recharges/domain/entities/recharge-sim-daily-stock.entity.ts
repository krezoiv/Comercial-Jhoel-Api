export interface RechargeSimDailyStockProps {
  id: string;
  simTypeId: string;
  simTypeName: string;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  date: string;
  previousStock: number;
  currentStock: number;
  /** Real `SUM(quantity)`/`SUM(total_cost)` from `recharge_sim_purchases` for this row — informational, never derivable from the other fields. */
  purchasedQuantity: number;
  purchasedTotal: number;
  /** Real `SUM(quantity)`/`SUM(total_amount)` from `recharge_sim_sales` for this row. */
  soldQuantity: number;
  soldTotal: number;
  createdByUserId: string;
  createdByUsername: string;
  updatedByUserId: string | null;
  updatedByUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * One row per (SIM type, calendar day) — mirrors `RechargeDailyBalance` but
 * for physical stock instead of a cash balance: no `finalBalance`/`sequence`
 * concept, since stock never "closes and resets" — `currentStock` is
 * always the live, correct stock as of that day, and IS the "stock final"
 * the cuadre shows (no separate confirmation step needed).
 */
export class RechargeSimDailyStock {
  private constructor(private readonly props: RechargeSimDailyStockProps) {}

  static create(props: RechargeSimDailyStockProps): RechargeSimDailyStock {
    return new RechargeSimDailyStock(props);
  }

  get id(): string {
    return this.props.id;
  }

  get simTypeId(): string {
    return this.props.simTypeId;
  }

  get simTypeName(): string {
    return this.props.simTypeName;
  }

  get date(): string {
    return this.props.date;
  }

  get previousStock(): number {
    return this.props.previousStock;
  }

  get currentStock(): number {
    return this.props.currentStock;
  }

  get purchasedQuantity(): number {
    return this.props.purchasedQuantity;
  }

  get purchasedTotal(): number {
    return this.props.purchasedTotal;
  }

  get soldQuantity(): number {
    return this.props.soldQuantity;
  }

  get soldTotal(): number {
    return this.props.soldTotal;
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
