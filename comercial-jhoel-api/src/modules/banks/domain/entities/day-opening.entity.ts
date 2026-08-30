export interface DayOpeningProps {
  id: string;
  date: string;
  openedBy: string;
  openedByUsername: string;
  openedAt: Date;
  closedAt: Date | null;
  closedBy: string | null;
  closedByUsername: string;
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

  /** "El día ya fue cerrado y no puede ser modificado" — la única pregunta que le importa a `SaveBankBalancesUseCase`/`CloseAgentDayUseCase`. */
  get isClosed(): boolean {
    return this.props.closedAt !== null;
  }
}
