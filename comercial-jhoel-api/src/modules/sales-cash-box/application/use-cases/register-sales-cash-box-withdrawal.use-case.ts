import { Inject, Injectable } from '@nestjs/common';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/sales-cash-box-movement.repository';
import type { SalesCashBoxMovementRepository } from '../../domain/repositories/sales-cash-box-movement.repository';
import {
  SalesCashBoxMovementOutput,
  toSalesCashBoxMovementOutput,
} from '../dtos/sales-cash-box-movement-output';

export interface RegisterSalesCashBoxWithdrawalInput {
  businessId: string;
  amount: number;
  concept: string;
  userId: string;
}

/**
 * "Retiro" — la validación de saldo NO se duplica aquí:
 * `register_sales_cash_box_movement` calcula el saldo disponible y rechaza
 * un retiro que lo exceda de forma atómica, dentro de su propio advisory
 * lock (por negocio) — un chequeo en TypeScript solo agregaría una ventana
 * TOCTOU, no la cerraría (mismo razonamiento ya establecido para Kardex
 * financiero/Recargas).
 */
@Injectable()
export class RegisterSalesCashBoxWithdrawalUseCase {
  constructor(
    @Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly repository: SalesCashBoxMovementRepository,
  ) {}

  async execute(
    input: RegisterSalesCashBoxWithdrawalInput,
  ): Promise<SalesCashBoxMovementOutput> {
    const movement = await this.repository.registerMovement({
      businessId: input.businessId,
      amount: input.amount,
      movementType: 'WITHDRAWAL',
      concept: input.concept,
      userId: input.userId,
    });
    return toSalesCashBoxMovementOutput(movement);
  }
}
