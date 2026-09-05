export interface BankDepositTransactionProps {
  id: string;
  sequence: number;
  amount: number;
}

/** One of the N sub-transactions the total amount is split into for the physical deposit. */
export class BankDepositTransaction {
  private constructor(private readonly props: BankDepositTransactionProps) {}

  static create(props: BankDepositTransactionProps): BankDepositTransaction {
    return new BankDepositTransaction(props);
  }

  get id(): string {
    return this.props.id;
  }

  get sequence(): number {
    return this.props.sequence;
  }

  get amount(): number {
    return this.props.amount;
  }
}
