import { Inject, Injectable } from '@nestjs/common';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/sales-cash-box-movement.repository';
import type { SalesCashBoxMovementRepository } from '../../domain/repositories/sales-cash-box-movement.repository';
import {
  SalesCashBoxMovementOutput,
  toSalesCashBoxMovementOutput,
} from '../dtos/sales-cash-box-movement-output';

export interface GetSalesCashBoxMovementsInput {
  businessId: string;
  limit?: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** Movimientos manuales (aportes/retiros) más recientes de UN negocio — incluye los anulados, para que el historial nunca oculte una corrección. */
@Injectable()
export class GetSalesCashBoxMovementsUseCase {
  constructor(
    @Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly repository: SalesCashBoxMovementRepository,
  ) {}

  async execute(
    input: GetSalesCashBoxMovementsInput,
  ): Promise<SalesCashBoxMovementOutput[]> {
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const movements = await this.repository.findMovements(
      input.businessId,
      limit,
    );
    return movements.map(toSalesCashBoxMovementOutput);
  }
}
