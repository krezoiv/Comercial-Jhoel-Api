/**
 * "Activos" — a client-linked Kardex/ledger: every row is a `CARGO` (adds to
 * the balance) or `ABONO` (subtracts) movement, `amount` always a positive
 * magnitude (see migration `CreateFinancialKardexColumns` — this replaced
 * the older "amount may be negative" convention from
 * `1758200000000-AllowNegativeAssetAmount`; a negative entry is now
 * `movementType: 'ABONO'` with a positive `amount`, not a negative
 * `amount`). The client's current balance subtracts from the daily Cuadre
 * Agentes result (`Cash + Banks + AccountsReceivable − Assets`, see
 * `GetCuadreAgentesSummaryUseCase` in the banks module). Structurally a
 * clone of `AccountReceivable` (same client-link/date/amount/description/
 * movementType/sequence shape, same soft delete), with one deliberate
 * behavioral delta: an `ABONO` here is allowed to exceed the current
 * balance (driving it negative) — `register_asset_movement` has no
 * equivalent to `register_account_receivable_movement`'s
 * `ABONO_EXCEEDS_BALANCE` guard, preserving the real, already-used
 * capability the old negative-`amount` convention provided (see that
 * function's own doc comment in the migration for why).
 */
export type AssetMovementType = 'CARGO' | 'ABONO';

export interface AssetProps {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  /** Always a positive magnitude — the sign is `movementType`, never encoded in `amount` itself. */
  movementType: AssetMovementType;
  sequence: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class Asset {
  private constructor(private readonly props: AssetProps) {}

  static create(props: AssetProps): Asset {
    return new Asset(props);
  }

  get id(): string {
    return this.props.id;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get clientName(): string {
    return this.props.clientName;
  }

  get date(): string {
    return this.props.date;
  }

  get amount(): number {
    return this.props.amount;
  }

  get movementType(): AssetMovementType {
    return this.props.movementType;
  }

  get sequence(): number {
    return this.props.sequence;
  }

  get description(): string | null {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
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
