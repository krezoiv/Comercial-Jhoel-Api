import { Inject, Injectable } from '@nestjs/common';
import { SALES_CASH_BOX_MOVEMENT_REPOSITORY } from '../../domain/repositories/sales-cash-box-movement.repository';
import type { SalesCashBoxMovementRepository } from '../../domain/repositories/sales-cash-box-movement.repository';

export interface SalesCashBoxBalanceOutput {
  businessId: string;
  businessName: string;
  /** Acumulado de todo el tiempo (nunca se reinicia) — ventas reales de ese negocio + aportes no anulados − retiros no anulados. */
  balance: number;
}

/** El saldo acumulado de cada negocio, en una sola consulta — nunca una llamada por tarjeta. */
@Injectable()
export class GetSalesCashBoxBalancesUseCase {
  constructor(
    @Inject(SALES_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly repository: SalesCashBoxMovementRepository,
  ) {}

  async execute(): Promise<SalesCashBoxBalanceOutput[]> {
    return this.repository.getBalances();
  }
}
