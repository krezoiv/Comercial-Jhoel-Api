/**
 * "Activos" — a client-linked amount that subtracts from the daily Cuadre
 * Agentes result (`Cash + Banks + AccountsReceivable − Assets`, see
 * `GetCuadreAgentesSummaryUseCase` in the banks module). Structurally a
 * clone of `AccountReceivable` (same client-link/date/amount/description
 * shape, same soft delete), with one deliberate delta: `amount` may be
 * negative here (migration `1758200000000-AllowNegativeAssetAmount`,
 * `CreateAssetRequestDto`'s own doc comment) to record a correcting/
 * reversing entry — `AccountReceivable.amount` stays positive-only.
 */
export interface AssetProps {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
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
