import { Inject, Injectable } from '@nestjs/common';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/sales-cash-box-movement.repository';
import type { SalesCashBoxMovementRepository } from '../../domain/repositories/sales-cash-box-movement.repository';
import { SalesCashBoxMovementNotFoundError } from '../../domain/errors/sales-cash-box-movement-not-found.error';
import { SalesCashBoxMovementAlreadyVoidedError } from '../../domain/errors/sales-cash-box-movement-already-voided.error';
import {
  SalesCashBoxMovementOutput,
  toSalesCashBoxMovementOutput,
} from '../dtos/sales-cash-box-movement-output';

export interface VoidSalesCashBoxMovementInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/** Corrección de un "Aporte"/"Retiro" equivocado — nunca una edición, nunca un borrado físico. */
@Injectable()
export class VoidSalesCashBoxMovementUseCase {
  constructor(
    @Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly repository: SalesCashBoxMovementRepository,
  ) {}

  async execute(
    input: VoidSalesCashBoxMovementInput,
  ): Promise<SalesCashBoxMovementOutput> {
    const movement = await this.repository.findById(input.id);
    if (!movement) {
      throw new SalesCashBoxMovementNotFoundError();
    }
    if (movement.isVoided) {
      throw new SalesCashBoxMovementAlreadyVoidedError();
    }

    const voided = await this.repository.voidMovement(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toSalesCashBoxMovementOutput(voided);
  }
}
