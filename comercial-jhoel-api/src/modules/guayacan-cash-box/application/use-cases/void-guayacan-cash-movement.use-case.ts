import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashMovementDetail,
} from '../../domain/repositories/guayacan-cash-box.repository';
import {
  GuayacanMovementNotFoundError,
  GuayacanReasonRequiredError,
} from '../../domain/errors/guayacan-cash-box.errors';
import { todayIsoDate } from '../utils/today-iso-date';

/** Anular (admin) un INGRESO/EGRESO/AJUSTE: el original queda ANULADO y se registra el movimiento inverso hoy. Nunca edita ni borra. */
@Injectable()
export class VoidGuayacanCashMovementUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(input: {
    id: string;
    reason: string;
    userId: string;
  }): Promise<GuayacanCashMovementDetail> {
    const reason = input.reason?.trim() ?? '';
    if (reason.length < 5) {
      throw new GuayacanReasonRequiredError();
    }
    await this.repository.voidMovement(
      input.id,
      todayIsoDate(),
      input.userId,
      reason,
    );

    const movement = await this.repository.findMovementById(input.id);
    if (!movement) {
      throw new GuayacanMovementNotFoundError(input.id);
    }
    return movement;
  }
}
