import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashDenominationData,
  GuayacanCashMovementDetail,
} from '../../domain/repositories/guayacan-cash-box.repository';
import {
  GuayacanInvalidAmountError,
  GuayacanMovementNotFoundError,
} from '../../domain/errors/guayacan-cash-box.errors';
import {
  assertBreakdownMatches,
  normalizeDenominations,
  resolveBusinessDate,
} from '../utils/cash-denominations';

export interface RegisterGuayacanCashMovementInput {
  movementType: 'INGRESO' | 'EGRESO';
  amount: number;
  businessDate?: string;
  concept: string;
  reason?: string | null;
  notes?: string | null;
  cashDetails?: GuayacanCashDenominationData[];
  clientRequestId?: string | null;
  userId: string;
}

/**
 * "+ Ingreso a caja" / "− Egreso de caja". Operativo (cualquier cuenta
 * activa, igual que Transaccionar). El saldo anterior/nuevo, el bloqueo y la
 * regla "el egreso no supera el efectivo" viven en
 * `register_guayacan_cash_movement`; aquí solo se normaliza la entrada y se
 * dan mensajes claros. `clientRequestId` (uno por modal abierto) hace
 * idempotente el doble clic / reintento.
 */
@Injectable()
export class RegisterGuayacanCashMovementUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(
    input: RegisterGuayacanCashMovementInput,
  ): Promise<GuayacanCashMovementDetail> {
    if (!(input.amount > 0)) {
      throw new GuayacanInvalidAmountError();
    }
    const cashDetails = normalizeDenominations(input.cashDetails ?? [], {
      keepZero: false,
    });
    assertBreakdownMatches(cashDetails, input.amount);

    const id = await this.repository.registerMovement({
      movementType: input.movementType,
      amount: input.amount,
      businessDate: resolveBusinessDate(input.businessDate),
      userId: input.userId,
      concept: input.concept.trim(),
      reason: input.reason?.trim() || null,
      notes: input.notes?.trim() || null,
      cashDetails,
      clientRequestId: input.clientRequestId ?? null,
    });

    const movement = await this.repository.findMovementById(id);
    if (!movement) {
      throw new GuayacanMovementNotFoundError(id);
    }
    return movement;
  }
}
