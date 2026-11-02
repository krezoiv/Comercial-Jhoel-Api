import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashCountRow,
} from '../../domain/repositories/guayacan-cash-box.repository';

/** Último arqueo registrado (`null` si nunca se ha contado) — el desglose "actual" de billetes y monedas. */
@Injectable()
export class GetLatestGuayacanCashCountUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(): Promise<GuayacanCashCountRow | null> {
    return this.repository.findLatestCount();
  }
}
