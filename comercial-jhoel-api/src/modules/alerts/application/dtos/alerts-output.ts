import { Alert, AlertPriority } from '../../domain/entities/alert.entity';

export interface AlertOutput {
  key: string;
  type: Alert['type'];
  priority: AlertPriority;
  title: string;
  description: string;
  amount: number | null;
  date: string | null;
  route: string;
  referenceId: string;
  isRead: boolean;
}

export interface AlertsOutput {
  /** Unread count — what the Navbar bell badge shows. */
  count: number;
  /** Every currently-active alert, read or not — the dropdown panel's own list. */
  total: number;
  items: AlertOutput[];
}

/** CRITICAL first, then HIGH, then MEDIUM; a stable, deterministic tiebreak by `key` within the same tier (the ticket names priority tiers but no required intra-tier order, so this is the simplest rule that's still fully deterministic, never array-insertion-order-dependent). */
const PRIORITY_RANK: Record<AlertPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
};

export function sortAlerts(alerts: Alert[]): Alert[] {
  return [...alerts].sort((a, b) => {
    const rankDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (rankDiff !== 0) return rankDiff;
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
}

export function toAlertOutput(alert: Alert, isRead: boolean): AlertOutput {
  return { ...alert, isRead };
}
