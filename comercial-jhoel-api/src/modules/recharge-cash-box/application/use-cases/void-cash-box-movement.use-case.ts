import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/recharge-cash-box-movement.repository';
import type { RechargeCashBoxMovementRepository } from '../../domain/repositories/recharge-cash-box-movement.repository';
import { RechargeCashBoxMovementNotFoundError } from '../../domain/errors/recharge-cash-box-movement-not-found.error';
import { RechargeCashBoxMovementAlreadyVoidedError } from '../../domain/errors/recharge-cash-box-movement-already-voided.error';
import {
  CashBoxMovementOutput,
  toCashBoxMovementOutput,
} from '../dtos/cash-box-movement-record-output';

export interface VoidCashBoxMovementInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/** The correction path for a mistaken "Aporte a Caja" or "Salida de Ganancia" — never an edit, never a physical delete. Works for either movement type (voiding logic doesn't depend on which one it is). Same shape as `VoidBankDepositOperationUseCase`. */
@Injectable()
export class VoidCashBoxMovementUseCase {
  constructor(
    @Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly cashBoxRepository: RechargeCashBoxMovementRepository,
  ) {}

  async execute(input: VoidCashBoxMovementInput): Promise<CashBoxMovementOutput> {
    const movement = await this.cashBoxRepository.findById(input.id);
    if (!movement) {
      throw new RechargeCashBoxMovementNotFoundError();
    }
    if (movement.isVoided) {
      throw new RechargeCashBoxMovementAlreadyVoidedError();
    }

    const voided = await this.cashBoxRepository.voidMovement(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toCashBoxMovementOutput(voided);
  }
}
