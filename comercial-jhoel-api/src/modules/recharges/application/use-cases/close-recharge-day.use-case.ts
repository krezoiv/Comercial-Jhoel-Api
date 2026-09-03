import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { RECHARGE_SALES_CLOSURE_REPOSITORY } from '../../domain/repositories/recharge-sales-closure.repository';
import type { RechargeSalesClosureRepository } from '../../domain/repositories/recharge-sales-closure.repository';
import { RechargeDayNotOpenedError } from '../../domain/errors/recharge-day-not-opened.error';
import { RechargeDayCancelledError } from '../../domain/errors/recharge-day-cancelled.error';
import { RechargeDayAlreadyClosedError } from '../../domain/errors/recharge-day-already-closed.error';
import { RechargeDayNotReadyToCloseError } from '../../domain/errors/recharge-day-not-ready-to-close.error';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import { GetRechargeDayStatusUseCase } from './get-recharge-day-status.use-case';
import { RechargeDayStatusOutput } from '../dtos/recharge-day-status-output';

export interface CloseRechargeDayInput {
  date: string;
  userId: string;
}

/**
 * "Cerrar Día" — the standalone action carrying no cuadre data of its own
 * (see the day-lifecycle migration's own doc comment for why this is
 * deliberately decoupled from "Guardar Cuadre", unlike Banks). Pre-checks
 * here mirror exactly what `close_recharge_day` (SQL) also enforces under
 * its own row lock — this layer gives the specific error message and
 * avoids the round-trip in the common case; the SQL function is the real
 * guarantee against a race between two near-simultaneous close attempts.
 */
@Injectable()
export class CloseRechargeDayUseCase {
  constructor(
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
    @Inject(RECHARGE_SALES_CLOSURE_REPOSITORY)
    private readonly salesClosureRepository: RechargeSalesClosureRepository,
    private readonly getRechargeDayStatusUseCase: GetRechargeDayStatusUseCase,
  ) {}

  async execute(input: CloseRechargeDayInput): Promise<RechargeDayStatusOutput> {
    assertValidOperationDate(input.date);

    const dayOpening = await this.dayOpeningRepository.findByDate(input.date);
    if (!dayOpening) {
      throw new RechargeDayNotOpenedError(input.date);
    }
    if (dayOpening.isCancelled) {
      throw new RechargeDayCancelledError(input.date);
    }
    if (dayOpening.isClosed) {
      throw new RechargeDayAlreadyClosedError(input.date);
    }

    const hasSavedCuadreToday = await this.salesClosureRepository.existsForDate(input.date);
    if (!hasSavedCuadreToday) {
      throw new RechargeDayNotReadyToCloseError(input.date);
    }

    await this.dayOpeningRepository.close(input.date, input.userId);
    return this.getRechargeDayStatusUseCase.execute(input.date);
  }
}
