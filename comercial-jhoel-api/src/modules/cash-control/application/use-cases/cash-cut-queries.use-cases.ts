import { Inject, Injectable } from '@nestjs/common';
import { CASH_CONTROL_REPOSITORY } from '../../domain/repositories/cash-control.repository';
import type {
  CashControlRepository,
  CashCutDetail,
  FindCashDaysOptions,
  PaginatedCashDays,
} from '../../domain/repositories/cash-control.repository';
import { cashControlError } from '../../domain/errors/cash-control.errors';

/**
 * "Historial de Cortes" — one row per operational day with its first and
 * second cut (scheduled/actual times, responsible users, status, opening/
 * closing cash, differences, bank reconciliation). Values are the stored
 * snapshots: never recomputed, so history stays exactly as it was closed.
 */
@Injectable()
export class ListCashDaysUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(
    options: Partial<FindCashDaysOptions>,
  ): Promise<PaginatedCashDays> {
    if (
      options.dateFrom &&
      options.dateTo &&
      options.dateFrom > options.dateTo
    ) {
      throw cashControlError('CASH_INVALID_DATE_RANGE');
    }
    return this.repository.findDays({
      ...options,
      page: Math.max(1, options.page ?? 1),
      limit: Math.min(100, Math.max(1, options.limit ?? 15)),
    });
  }
}

/** "Consultar detalle" of one cut: arqueos (current + superseded), bank reconciliation, audit events, schedule changes and its Kardex range. */
@Injectable()
export class GetCashCutDetailUseCase {
  constructor(
    @Inject(CASH_CONTROL_REPOSITORY)
    private readonly repository: CashControlRepository,
  ) {}

  async execute(periodId: string): Promise<CashCutDetail> {
    const detail = await this.repository.findCutDetail(periodId);
    if (!detail) {
      throw cashControlError('CASH_CUT_NOT_FOUND');
    }
    return detail;
  }
}
