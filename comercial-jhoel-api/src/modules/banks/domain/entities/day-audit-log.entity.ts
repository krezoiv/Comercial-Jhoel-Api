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
 * Una fila por transición del CICLO de un día (apertura, cierre/recierre,
 * reapertura, anulación) — no un log genérico de cambios de campo. Ver
 * `ReopenDayUseCase`/`CancelDayUseCase`/`close_agent_day` (SQL) para dónde
 * se escribe cada acción.
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
