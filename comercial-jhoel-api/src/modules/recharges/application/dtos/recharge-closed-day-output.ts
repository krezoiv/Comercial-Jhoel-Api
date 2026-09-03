import {
  RechargeClosedDayStatus,
  RechargeClosedDayViewRow,
} from '../../domain/repositories/recharge-day-opening.repository';

export interface RechargeClosedDayOutput {
  date: string;
  status: RechargeClosedDayStatus;
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
  totalSales: number | null;
  totalCollected: number | null;
  result: number | null;
  cycleCount: number;
}

export function toRechargeClosedDayOutput(
  row: RechargeClosedDayViewRow,
): RechargeClosedDayOutput {
  return { ...row };
}
