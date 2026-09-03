export type DayAuditAction = 'OPENED' | 'CLOSED' | 'REOPENED' | 'CANCELLED';

export interface DayAuditLogProps {
  id: string;
  date: string;
  action: DayAuditAction;
  performedBy: string;
  performedByUsername: string;
  performedAt: Date;
  reason: string | null;
  previousStatus: string | null;
  newStatus: string | null;
}

/**
 * One row per CYCLE transition of a day (opening, close/re-close,
 * reopening, cancellation) — not a generic field-change log. See
 * `ReopenDayUseCase`/`CancelDayUseCase`/`close_agent_day` (SQL) for where
 * each action is written.
 */
export class DayAuditLog {
  private constructor(private readonly props: DayAuditLogProps) {}

  static create(props: DayAuditLogProps): DayAuditLog {
    return new DayAuditLog(props);
  }

  get id(): string {
    return this.props.id;
  }

  get date(): string {
    return this.props.date;
  }

  get action(): DayAuditAction {
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
