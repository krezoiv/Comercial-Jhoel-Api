export interface BankDepositCashDetailProps {
  id: string;
  denomination: number;
  quantity: number;
  subtotal: number;
}

/** One row of the physical cash breakdown (e.g. Q100 × 5 = Q500) — frozen once the operation is registered. */
export class BankDepositCashDetail {
  private constructor(private readonly props: BankDepositCashDetailProps) {}

  static create(props: BankDepositCashDetailProps): BankDepositCashDetail {
    return new BankDepositCashDetail(props);
  }

  get id(): string {
    return this.props.id;
  }

  get denomination(): number {
    return this.props.denomination;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get subtotal(): number {
    return this.props.subtotal;
  }
}
