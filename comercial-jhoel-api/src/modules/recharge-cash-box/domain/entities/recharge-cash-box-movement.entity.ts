export type CashBoxMovementType = 'CONTRIBUTION' | 'WITHDRAWAL';

export interface RechargeCashBoxMovementProps {
  id: string;
  amount: number;
  movementType: CashBoxMovementType;
  /** Fecha de negocio (America/Guatemala) — independent of `createdAt`, the real audit timestamp. */
  businessDate: string;
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
 * A manual Caja Contable movement — "Aporte a Caja" (income) or "Salida de
 * Ganancia" (expense), the only two Caja Contable movements that aren't
 * derived live from an existing sale/purchase table (see the migration's
 * own doc comment). `amount` is always a positive magnitude; the sign is
 * derived from `movementType` at read time, never stored — same convention
 * as Kardex financiero's `AccountReceivable`/`Asset` entities. Never
 * physically deleted; corrected only via `voidMovement`, same as
 * `bank_deposit_operations`.
 */
export class RechargeCashBoxMovement {
  private constructor(private readonly props: RechargeCashBoxMovementProps) {}

  static create(props: RechargeCashBoxMovementProps): RechargeCashBoxMovement {
    return new RechargeCashBoxMovement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get amount(): number {
    return this.props.amount;
  }

  get movementType(): CashBoxMovementType {
    return this.props.movementType;
  }

  get businessDate(): string {
    return this.props.businessDate;
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
