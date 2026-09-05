export interface TransactionBankProps {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** "Banco Agente" — the simple catalog Transaccionar's dropdown reads from. Deliberately separate from `banks` (Sistema→Bancos / Agentes Bancarios→Bancos), which is a heavier entity tied to account numbers and Cuadre de Agentes balances. */
export class TransactionBank {
  private constructor(private readonly props: TransactionBankProps) {}

  static create(props: TransactionBankProps): TransactionBank {
    return new TransactionBank(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
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
