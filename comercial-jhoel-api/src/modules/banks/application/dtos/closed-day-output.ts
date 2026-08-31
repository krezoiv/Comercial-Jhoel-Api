import { ClosedDayStatus, ClosedDayViewRow } from '../../domain/repositories/day-opening.repository';

export interface ClosedDayOutput {
  date: string;
  status: ClosedDayStatus;
  openedAt: Date;
  openedByUsername: string;
  closedAt: Date | null;
  closedByUsername: string | null;
  reopenedAt: Date | null;
  reopenedByUsername: string | null;
  reopenReason: string | null;
  cancelledAt: Date | null;
  cancelledByUsername: string | null;
  cancelReason: string | null;
  totalBanks: number | null;
  totalCash: number | null;
  totalAccountsReceivable: number | null;
  totalAssets: number | null;
  result: number | null;
}

export function toClosedDayOutput(row: ClosedDayViewRow): ClosedDayOutput {
  return { ...row };
}
