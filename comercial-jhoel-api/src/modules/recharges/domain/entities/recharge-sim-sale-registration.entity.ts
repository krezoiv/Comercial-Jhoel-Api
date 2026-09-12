export interface RechargeSimSaleRegistrationProps {
  id: string;
  rechargeSimSaleId: string;
  simTypeId: string;
  simTypeName: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  clientName: string | null;
  salePrice: number;
  /** `yyyy-MM-dd` — a calendar day, not a timestamp; the operation date the sale was registered under. */
  saleDate: string;
  /** `true` when a DPI photo was uploaded — the raw image bytes/id are never exposed here, only through `GET /recharges/sims/sale-registrations/:id/dpi-image`. */
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: Date;
}

/**
 * One physical SIM sold with identity capture (número de SIM, SKU, DPI del
 * comprador, foto) — a compliance record layered on top of one `quantity=1`
 * row in the existing `recharge_sim_sales` table (see the migration's own
 * doc comment for why this is additive, not a replacement). Void-only, same
 * "anular con motivo, nunca editar/borrar" rule as every other financial
 * record in this codebase.
 */
export class RechargeSimSaleRegistration {
  private constructor(private readonly props: RechargeSimSaleRegistrationProps) {}

  static create(props: RechargeSimSaleRegistrationProps): RechargeSimSaleRegistration {
    return new RechargeSimSaleRegistration(props);
  }

  get id(): string {
    return this.props.id;
  }

  get rechargeSimSaleId(): string {
    return this.props.rechargeSimSaleId;
  }

  get simTypeId(): string {
    return this.props.simTypeId;
  }

  get simTypeName(): string {
    return this.props.simTypeName;
  }

  get simNumber(): string {
    return this.props.simNumber;
  }

  get sku(): string {
    return this.props.sku;
  }

  get clientDpi(): string {
    return this.props.clientDpi;
  }

  get clientId(): string | null {
    return this.props.clientId;
  }

  get clientName(): string | null {
    return this.props.clientName;
  }

  get salePrice(): number {
    return this.props.salePrice;
  }

  get saleDate(): string {
    return this.props.saleDate;
  }

  get hasDpiImage(): boolean {
    return this.props.hasDpiImage;
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

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdByUsername(): string {
    return this.props.createdByUsername;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
