export interface RechargePurchaseProps {
  id: string;
  rechargeTypeId: string;
  rechargeTypeName: string;
  dailyBalanceId: string;
  /** "Monto de Compra" — informational only, never affects the running balance. */
  amount: number;
  /** "Monto Acreditado" — the only value that increments/decrements the running balance. */
  creditedAmount: number;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  date: string;
  /** Whether the cycle this purchase was recorded under is still open — mirrors the referenced daily-balance row's `finalBalance === null`. Once locked, it can no longer be reverted (see `void_recharge_purchase`'s own doc comment for why no mechanism un-closes an already-closed cycle). */
  locked: boolean;
  createdByUserId: string;
  createdByUsername: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUserId: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/**
 * One individual recharge purchase — the counterpart to `RechargeSale` on
 * the "bought from the operator" side. Kept forever for audit/history;
 * `dailyBalanceId` ties it to the exact cuadre cycle it was recorded
 * under. Never physically deleted — corrected only via a "Revertir"
 * action (`voidRechargePurchase`), same convention as
 * `bank_deposit_operations`/`recharge_cash_box_movements`.
 */
export class RechargePurchase {
  private constructor(private readonly props: RechargePurchaseProps) {}

  static create(props: RechargePurchaseProps): RechargePurchase {
    return new RechargePurchase(props);
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

  get amount(): number {
    return this.props.amount;
  }

  get creditedAmount(): number {
    return this.props.creditedAmount;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isVoided(): boolean {
    return this.props.isVoided;
  }

  get voidedAt(): Date | null {
    return this.props.voidedAt;
  }

  get voidedByUserId(): string | null {
    return this.props.voidedByUserId;
  }

  get voidedByUsername(): string | null {
    return this.props.voidedByUsername;
  }

  get voidReason(): string | null {
    return this.props.voidReason;
  }
}
