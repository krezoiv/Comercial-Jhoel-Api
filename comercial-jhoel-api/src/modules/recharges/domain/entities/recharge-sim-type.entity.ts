export interface RechargeSimTypeProps {
  id: string;
  name: string;
  costPrice: number;
  publicPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** SIM Claro / SIM Tigo — a 2-row lookup, mirrors `RechargeType` exactly. Prices are fixed catalog values, never accepted from a purchase/sale request. */
export class RechargeSimType {
  private constructor(private readonly props: RechargeSimTypeProps) {}

  static create(props: RechargeSimTypeProps): RechargeSimType {
    return new RechargeSimType(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get costPrice(): number {
    return this.props.costPrice;
  }

  get publicPrice(): number {
    return this.props.publicPrice;
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
}
