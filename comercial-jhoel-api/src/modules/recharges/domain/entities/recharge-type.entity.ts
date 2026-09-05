export interface RechargeTypeProps {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** `0` means "no threshold configured" — the Alerts module never alerts for this type until an admin sets a real minimum. */
  minBalance: number;
}

/** Claro/Tigo today — a normalized lookup row, not a hardcoded string, so a future operator is a new seeded row rather than a code change. */
export class RechargeType {
  private constructor(private readonly props: RechargeTypeProps) {}

  static create(props: RechargeTypeProps): RechargeType {
    return new RechargeType(props);
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

  get minBalance(): number {
    return this.props.minBalance;
  }
}
