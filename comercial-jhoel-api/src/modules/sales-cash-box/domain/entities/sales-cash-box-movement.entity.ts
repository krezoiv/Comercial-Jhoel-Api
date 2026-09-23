export type CashBoxMovementType = 'CONTRIBUTION' | 'WITHDRAWAL';

export interface SalesCashBoxMovementProps {
  id: string;
  businessId: string;
  amount: number;
  movementType: CashBoxMovementType;
  concept: string;
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
 * A manual Caja de Ventas movement — "Aporte" (income) or "Retiro"
 * (expense) — for ONE negocio's accumulated cash balance. `amount` is
 * always a positive magnitude; the sign is derived from `movementType` at
 * read time, never stored — same convention as Recargas' own
 * `RechargeCashBoxMovement` and Kardex financiero's
 * `AccountReceivable`/`Asset`. Never physically deleted; corrected only via
 * `voidMovement`.
 */
export class SalesCashBoxMovement {
  private constructor(private readonly props: SalesCashBoxMovementProps) {}

  static create(props: SalesCashBoxMovementProps): SalesCashBoxMovement {
    return new SalesCashBoxMovement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get businessId(): string {
    return this.props.businessId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get movementType(): CashBoxMovementType {
    return this.props.movementType;
  }

  get concept(): string {
    return this.props.concept;
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
