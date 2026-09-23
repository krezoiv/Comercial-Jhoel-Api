import { Inject, Injectable } from '@nestjs/common';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/sales-cash-box-movement.repository';
import type { SalesCashBoxMovementRepository } from '../../domain/repositories/sales-cash-box-movement.repository';
import {
  SalesCashBoxMovementOutput,
  toSalesCashBoxMovementOutput,
} from '../dtos/sales-cash-box-movement-output';

export interface RegisterSalesCashBoxContributionInput {
  businessId: string;
  amount: number;
  concept: string;
  userId: string;
}

/** "Aporte" — nunca necesita validar saldo, solo suma (ver `register_sales_cash_box_movement`, que omite el chequeo de saldo cuando `movementType = 'CONTRIBUTION'`). */
@Injectable()
export class RegisterSalesCashBoxContributionUseCase {
  constructor(
    @Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly repository: SalesCashBoxMovementRepository,
  ) {}

  async execute(
    input: RegisterSalesCashBoxContributionInput,
  ): Promise<SalesCashBoxMovementOutput> {
    const movement = await this.repository.registerMovement({
      businessId: input.businessId,
      amount: input.amount,
      movementType: 'CONTRIBUTION',
      concept: input.concept,
      userId: input.userId,
    });
    return toSalesCashBoxMovementOutput(movement);
  }
}
