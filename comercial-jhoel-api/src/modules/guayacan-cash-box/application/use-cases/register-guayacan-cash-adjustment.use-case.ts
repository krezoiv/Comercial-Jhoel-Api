import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashMovementDetail,
} from '../../domain/repositories/guayacan-cash-box.repository';
import {
  GuayacanInvalidAmountError,
  GuayacanMovementNotFoundError,
  GuayacanReasonRequiredError,
} from '../../domain/errors/guayacan-cash-box.errors';
import { resolveBusinessDate } from '../utils/cash-denominations';

export interface RegisterGuayacanCashAdjustmentInput {
  /** Con signo: positivo = sobrante, negativo = faltante. */
  amount: number;
  businessDate?: string;
  concept: string;
  reason: string;
  notes?: string | null;
  clientRequestId?: string | null;
  userId: string;
}

/** Ajuste autorizado (admin, `@Roles` en el controlador) — la única forma de corregir una diferencia entre arqueo y Kardex. Motivo obligatorio. */
@Injectable()
export class RegisterGuayacanCashAdjustmentUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(
    input: RegisterGuayacanCashAdjustmentInput,
  ): Promise<GuayacanCashMovementDetail> {
    if (!input.amount || !Number.isFinite(input.amount)) {
      throw new GuayacanInvalidAmountError();
    }
    const reason = input.reason?.trim() ?? '';
    if (reason.length < 5) {
      throw new GuayacanReasonRequiredError();
    }

    const id = await this.repository.registerMovement({
      movementType: 'AJUSTE',
      amount: input.amount,
      businessDate: resolveBusinessDate(input.businessDate),
      userId: input.userId,
      concept: input.concept.trim(),
      reason,
      notes: input.notes?.trim() || null,
      cashDetails: [],
      clientRequestId: input.clientRequestId ?? null,
    });

    const movement = await this.repository.findMovementById(id);
    if (!movement) {
      throw new GuayacanMovementNotFoundError(id);
    }
    return movement;
  }
}
