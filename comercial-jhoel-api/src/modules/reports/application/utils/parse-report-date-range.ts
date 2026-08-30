import { InvalidDateRangeError } from '../../domain/errors/invalid-date-range.error';

export interface ReportDateRange {
  startDate?: Date;
  endDate?: Date;
}

/**
 * Query params arrive as plain `yyyy-MM-dd` (a date picker has no time
 * component) — `startDate` is widened to 00:00:00.000 of that day and
 * `endDate` to 23:59:59.999, so a same-day range still captures every sale/
 * purchase recorded that day instead of matching nothing. Local server time
 * is used throughout, consistent with how `CreatePurchaseUseCase` already
 * treats `purchaseDate` elsewhere in this codebase — no explicit UTC
 * normalization.
 */
export function parseReportDateRange(
  startDate?: string,
  endDate?: string,
): ReportDateRange {
  const start = startDate ? new Date(`${startDate}T00:00:00.000`) : undefined;
  const end = endDate ? new Date(`${endDate}T23:59:59.999`) : undefined;

  if (start && end && start.getTime() > end.getTime()) {
    throw new InvalidDateRangeError();
  }

  return { startDate: start, endDate: end };
}
