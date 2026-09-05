export interface AlertSettingsProps {
  id: string;
  purchasePaymentAlertDays: number;
  updatedAt: Date;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** A genuine singleton — exactly one row always exists (seeded by migration `1760000300000-CreateAlertSettings`). Holds the one truly-global alert threshold (`purchasePaymentAlertDays`); per-entity thresholds (`inventory_stock.min_stock`, `recharge_types.min_balance`) live on their own owning tables instead — see that migration's own doc comment. */
export class AlertSettings {
  private constructor(private readonly props: AlertSettingsProps) {}

  static create(props: AlertSettingsProps): AlertSettings {
    return new AlertSettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get purchasePaymentAlertDays(): number {
    return this.props.purchasePaymentAlertDays;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get updatedBy(): string | null {
    return this.props.updatedBy;
  }

  get updatedByUsername(): string | null {
    return this.props.updatedByUsername;
  }
}
