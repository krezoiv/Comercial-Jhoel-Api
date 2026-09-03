/**
 * "Cuentas por Cobrar" — a client-linked amount owed to the business,
 * added into the daily Cuadre Agentes result (`Cash + Banks +
 * AccountsReceivable − Assets`, see `GetCuadreAgentesSummaryUseCase` in
 * the banks module). Structurally a clone of `Asset` — see that entity's
 * own doc comment for the one deliberate delta: this `amount` stays
 * positive-only (`CHK_accounts_receivable_amount_positive`), unlike
 * `Asset.amount`.
 */
export interface AccountReceivableProps {
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

export class AccountReceivable {
  private constructor(private readonly props: AccountReceivableProps) {}

  static create(props: AccountReceivableProps): AccountReceivable {
    return new AccountReceivable(props);
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
