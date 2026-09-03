export interface RechargeDayOpeningProps {
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

/**
 * "The user confirmed they want to start registering recharge operations
 * for this date" — a fully independent cycle from Banks' own `DayOpening`
 * (see the migration's own doc comment for why the two modules can never
 * share one table). Unlike Banks, closing this cycle never carries a
 * business/reconciliation row of its own — see `isClosed`'s own comment.
 */
export class RechargeDayOpening {
  private constructor(private readonly props: RechargeDayOpeningProps) {}

  static create(props: RechargeDayOpeningProps): RechargeDayOpening {
    return new RechargeDayOpening(props);
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

  /**
   * "The day is already closed and can't accept new operations" — the
   * only question every write use case in this module actually cares
   * about (see `assertRechargeDayWritable`). Deliberately still `false`
   * for a REOPENED day (`closedAt` goes back to `null`), same reasoning
   * as Banks' own `DayOpening.isClosed`.
   */
  get isClosed(): boolean {
    return this.props.closedAt !== null;
  }

  /** Was closed, then reopened, and hasn't been closed again yet. */
  get isReopened(): boolean {
    return this.props.reopenedAt !== null && this.props.closedAt === null;
  }
}
