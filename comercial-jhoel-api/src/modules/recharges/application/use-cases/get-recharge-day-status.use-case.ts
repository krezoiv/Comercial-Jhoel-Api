import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from '../../domain/repositories/recharge-sales-closure.repository';
import type { RechargeSalesClosureRepository } from '../../domain/repositories/recharge-sales-closure.repository';
import { RechargeDayStatusOutput, RechargeDayWorkStatus } from '../dtos/recharge-day-status-output';

/**
 * Combines two independent sources into a single response — never
 * duplicates their logic: `RechargeDayOpeningRepository` (is it open? is
 * it closed?) and `RechargeSalesClosureRepository.existsForDate` (has at
 * least one cuadre been saved today? — the "Cerrar Día" precondition).
 */
@Injectable()
export class GetRechargeDayStatusUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    @Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)
    private readonly salesClosureRepository: RechargeSalesClosureRepository,
  ) {}

  async execute(date: string): Promise<RechargeDayStatusOutput> {
    const [dayOpening, hasSavedCuadreToday] = await Promise.all([
      this.dayOpeningRepository.findByDate(date),
      this.salesClosureRepository.existsForDate(date),
    ]);

    const isOpened = dayOpening !== null;
    const isClosed = dayOpening?.isClosed ?? false;
    const isCancelled = dayOpening?.isCancelled ?? false;
    const isReopened = dayOpening?.isReopened ?? false;

    let status: RechargeDayWorkStatus;
    if (isCancelled) {
      status = 'CANCELLED';
    } else if (isClosed) {
      status = 'CLOSED';
    } else if (isReopened) {
      status = 'REOPENED';
    } else if (isOpened) {
      status = 'OPENED';
    } else {
      status = 'NOT_OPENED';
    }

    return {
      date,
      status,
      isOpened,
      isClosed,
      isCancelled,
      hasSavedCuadreToday,
      canCloseDay: isOpened && !isClosed && !isCancelled && hasSavedCuadreToday,
    };
  }
}
