import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashCountRow,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanCountNotFoundError } from '../../domain/errors/guayacan-cash-box.errors';

/** Detalle histórico e inmutable de un arqueo — todas las denominaciones tal como se guardaron. */
@Injectable()
export class GetGuayacanCashCountUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(id: string): Promise<GuayacanCashCountRow> {
    const count = await this.repository.findCountById(id);
    if (!count) {
      throw new GuayacanCountNotFoundError();
    }
    return count;
  }
}
