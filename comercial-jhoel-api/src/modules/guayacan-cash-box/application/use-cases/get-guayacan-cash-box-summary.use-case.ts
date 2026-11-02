import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashBoxSummary,
} from '../../domain/repositories/guayacan-cash-box.repository';

/**
 * Tarjetas e indicadores: saldo del Kardex + día / semana (lunes–domingo) /
 * mes de Guatemala. Solo cambia el RANGO consultado — nada se reinicia ni se
 * borra al cambiar de período. Transacciones = `SUM(transaction_count)` de
 * operaciones Guayacán no anuladas; comisión = comisiones vigentes.
 */
@Injectable()
export class GetGuayacanCashBoxSummaryUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(): Promise<GuayacanCashBoxSummary> {
    return this.repository.getSummary();
  }
}
