export type RechargeDayAuditAction = 'OPENED' | 'CLOSED' | 'REOPENED' | 'CANCELLED';

export interface RechargeDayAuditLogProps {
  id: string;
  date: string;
  action: RechargeDayAuditAction;
  performedBy: string;
  performedByUsername: string;
  performedAt: Date;
  reason: string | null;
  previousStatus: string | null;
  newStatus: string | null;
}

/**
 * One row per CYCLE transition of a Recargas day (opening, closing,
 * reopening, cancellation) — not a generic field-change log, same scope
 * as Banks' own `DayAuditLog`. Deliberately does NOT log individual
 * purchase/sale/cuadre operations — those already have their own
 * historical trail (`recharge_purchases`, `recharge_sales`,
 * `recharge_sales_closures`); this table is only the day cycle's own
 * history.
 */
export class RechargeDayAuditLog {
  private constructor(private readonly props: RechargeDayAuditLogProps) {}

  static create(props: RechargeDayAuditLogProps): RechargeDayAuditLog {
    return new RechargeDayAuditLog(props);
  }

  get id(): string {
    return this.props.id;
  }

  get date(): string {
    return this.props.date;
  }

  get action(): RechargeDayAuditAction {
    return this.props.action;
  }

  get performedBy(): string {
    return this.props.performedBy;
  }

  get performedByUsername(): string {
    return this.props.performedByUsername;
  }

  get performedAt(): Date {
    return this.props.performedAt;
  }

  get reason(): string | null {
    return this.props.reason;
  }

  get previousStatus(): string | null {
    return this.props.previousStatus;
  }

  get newStatus(): string | null {
    return this.props.newStatus;
  }
}
