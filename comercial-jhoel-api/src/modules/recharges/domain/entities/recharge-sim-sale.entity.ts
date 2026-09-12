export interface RechargeSimSaleProps {
  id: string;
  simTypeId: string;
  simTypeName: string;
  dailyStockId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp. */
  saleDate: string;
  /** `true` when this sale already has an active (non-voided) identity registration — see `SimSaleHasRegistrationError`'s own doc comment for why such a sale can never be voided through this entity's own flow. */
  hasActiveRegistration: boolean;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

/**
 * One by-quantity "Vender SIM" sale (no identity capture) — the original,
 * still-in-use quick-sale flow this module started with. Never physically
 * deleted; corrected only via "Revertir" (`void_recharge_sim_sale`), same
 * convention as `RechargePurchase`/`bank_deposit_operations`. Unlike
 * `RechargePurchase`, this entity has no `locked` concept at all — SIM
 * stock has no cuadre cycle/sequence, so the only thing that can block a
 * revert is the sale's own day being closed or an active identity
 * registration already covering the same physical sale.
 */
export class RechargeSimSale {
  private constructor(private readonly props: RechargeSimSaleProps) {}

  static create(props: RechargeSimSaleProps): RechargeSimSale {
    return new RechargeSimSale(props);
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

  get dailyStockId(): string {
    return this.props.dailyStockId;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): number {
    return this.props.unitPrice;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get saleDate(): string {
    return this.props.saleDate;
  }

  get hasActiveRegistration(): boolean {
    return this.props.hasActiveRegistration;
  }

  get createdBy(): string {
    return this.props.createdBy;
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

  get voidedBy(): string | null {
    return this.props.voidedBy;
  }

  get voidedByUsername(): string | null {
    return this.props.voidedByUsername;
  }

  get voidReason(): string | null {
    return this.props.voidReason;
  }
}
