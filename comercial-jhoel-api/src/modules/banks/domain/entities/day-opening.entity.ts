export interface DayOpeningProps {
  id: string;
  date: string;
  openedBy: string;
  openedByUsername: string;
  openedAt: Date;
  closedAt: Date | null;
  closedBy: string | null;
  closedByUsername: string;
  reopenedAt: Date | null;
  reopenedBy: string | null;
  reopenedByUsername: string;
  reopenReason: string | null;
  isCancelled: boolean;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelledByUsername: string;
  cancelReason: string | null;
}

/** "El usuario confirmó que quiere empezar a trabajar en esta fecha" — independiente de si ya hay saldos guardados. */
export class DayOpening {
  private constructor(private readonly props: DayOpeningProps) {}

  static create(props: DayOpeningProps): DayOpening {
    return new DayOpening(props);
  }

  get id(): string {
    return this.props.id;
  }

  get date(): string {
    return this.props.date;
  }

  get openedBy(): string {
    return this.props.openedBy;
  }

  get openedByUsername(): string {
    return this.props.openedByUsername;
  }

  get openedAt(): Date {
    return this.props.openedAt;
  }

  get closedAt(): Date | null {
    return this.props.closedAt;
  }

  get closedBy(): string | null {
    return this.props.closedBy;
  }

  get closedByUsername(): string {
    return this.props.closedByUsername;
  }

  get reopenedAt(): Date | null {
    return this.props.reopenedAt;
  }

  get reopenedBy(): string | null {
    return this.props.reopenedBy;
  }

  get reopenedByUsername(): string {
    return this.props.reopenedByUsername;
  }

  get reopenReason(): string | null {
    return this.props.reopenReason;
  }

  get isCancelled(): boolean {
    return this.props.isCancelled;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  get cancelledBy(): string | null {
    return this.props.cancelledBy;
  }

  get cancelledByUsername(): string {
    return this.props.cancelledByUsername;
  }

  get cancelReason(): string | null {
    return this.props.cancelReason;
  }

  /** "El día ya fue cerrado y no puede ser modificado" — la única pregunta que le importa a `SaveBankBalancesUseCase`/`CloseAgentDayUseCase`. Sigue siendo `false` para un día REOPENED (closed_at vuelve a NULL), a propósito: es lo que reactiva la edición sin tocar esos use cases. */
  get isClosed(): boolean {
    return this.props.closedAt !== null;
  }

  /** Fue cerrado, luego reabierto, y todavía no se ha vuelto a cerrar. */
  get isReopened(): boolean {
    return this.props.reopenedAt !== null && this.props.closedAt === null;
  }
}
