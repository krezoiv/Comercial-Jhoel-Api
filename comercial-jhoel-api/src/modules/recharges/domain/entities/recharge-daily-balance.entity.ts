export interface RechargeDailyBalanceProps {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  date: string;
  /** Which cuadre cycle this row is, within its (type, date) — 1 for the first, incremented every time "Guardar cuadre" resets this type's cycle. Internal bookkeeping only, never serialized to the frontend. */
  sequence: number;
  previousBalance: number;
  dailyBalance: number;
  finalBalance: number | null;
  /** Real `SUM(recharge_purchases.amount)` for this row's cycle — "Compra" total, purely informational (never derivable from the balances above since `dailyBalance` now grows by `creditedAmount`, not `purchaseAmount`). */
  totalPurchaseAmount: number;
  createdByUserId: string;
  createdByUsername: string;
  updatedByUserId: string | null;
  updatedByUsername: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * One row per (recharge type, calendar day) — the day's running total for
 * that operator. `totalPurchases` and `sale` are deliberately NOT stored
 * columns: both are always exactly derivable from the three balances this
 * row already holds (`dailyBalance - previousBalance`,
 * `dailyBalance - finalBalance`), so storing them would just be a second
 * copy of the same fact that could drift — same "derive, don't duplicate"
 * choice the Reports module already made for its own KPIs.
 */
export class RechargeDailyBalance {
  private constructor(private readonly props: RechargeDailyBalanceProps) {}

  static create(props: RechargeDailyBalanceProps): RechargeDailyBalance {
    return new RechargeDailyBalance(props);
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

  get date(): string {
    return this.props.date;
  }

  get sequence(): number {
    return this.props.sequence;
  }

  get previousBalance(): number {
    return this.props.previousBalance;
  }

  get dailyBalance(): number {
    return this.props.dailyBalance;
  }

  get finalBalance(): number | null {
    return this.props.finalBalance;
  }

  /**
   * "Acreditado" — how much actually fed the running balance today, always
   * `dailyBalance - previousBalance`. Kept as a derived getter (unchanged
   * since before the Monto de Compra/Acreditado split) since `dailyBalance`
   * only ever grows by `creditedAmount`, never `purchaseAmount` — this
   * value and `totalPurchaseAmount` (see prop) can legitimately differ now.
   */
  get totalPurchases(): number {
    return this.props.dailyBalance - this.props.previousBalance;
  }

  /** "Compra" — real sum of every purchase's `purchaseAmount` this cycle, informational only. */
  get totalPurchaseAmount(): number {
    return this.props.totalPurchaseAmount;
  }

  /** `null` until the day is closed (no `finalBalance` yet) — never a premature 0. */
  get sale(): number | null {
    return this.props.finalBalance === null
      ? null
      : this.props.dailyBalance - this.props.finalBalance;
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
