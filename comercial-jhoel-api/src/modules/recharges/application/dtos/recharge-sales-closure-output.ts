import { RechargeSalesClosure } from '../../domain/entities/recharge-sales-closure.entity';

/**
 * Individual cuadre-cycle output — never exposed standalone before this
 * ticket (only merged into `RechargeSalesSummaryOutput`'s single "current
 * cycle" shape). Needed here because "Gestión de Días de Recargas"' day
 * detail shows every cycle saved for a date, not just the latest one.
 */
export interface RechargeSalesClosureOutput {
  id: string;
  sequence: number;
  totalSales: number;
  totalCollected: number;
  result: number;
  createdByUsername: string;
  createdAt: Date;
}

export function toRechargeSalesClosureOutput(
  closure: RechargeSalesClosure,
): RechargeSalesClosureOutput {
  return {
    id: closure.id,
    sequence: closure.sequence,
    totalSales: closure.totalSales,
    totalCollected: closure.totalCollected,
    result: closure.result,
    createdByUsername: closure.createdByUsername,
    createdAt: closure.createdAt,
  };
}
