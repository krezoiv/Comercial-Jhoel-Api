export interface BankProps {
  id: string;
  name: string;
  accountNumber: string;
  accountTypeId: string;
  accountTypeName: string;
  /**
   * `previousBalance`/`finalBalance` here are cached "current" figures on
   * `banks` itself — `previousBalance` is only ever the bank's *configured
   * opening* balance (set at creation, editable via Sistema → Bancos), and
   * `finalBalance` is kept in sync with whatever `bank_balances` row is
   * most recent for this bank, but only when a cuadre is saved for that
   * latest date (see `save_bank_balance()`, migration
   * `1758500000000-OnlySyncBanksFinalBalanceForLatestDate` — a *backdated*
   * correction never overwrites this). Neither field reflects a specific
   * operation date on its own; for a given date's actual previous/final
   * balance, see `BankBalanceView` instead, which resolves both from the
   * real `bank_balances` history.
   */
  previousBalance: number;
  finalBalance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class Bank {
  private constructor(private readonly props: BankProps) {}

  static create(props: BankProps): Bank {
    return new Bank(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get accountTypeId(): string {
    return this.props.accountTypeId;
  }

  get accountTypeName(): string {
    return this.props.accountTypeName;
  }

  get previousBalance(): number {
    return this.props.previousBalance;
  }

  get finalBalance(): number {
    return this.props.finalBalance;
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
