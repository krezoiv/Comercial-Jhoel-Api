import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  PaginatedGuayacanCommissions,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanInvalidDateError } from '../../domain/errors/guayacan-cash-box.errors';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/** Comisiones de Cooperativa Guayacán — concepto propio, fuera del efectivo de caja. Más reciente primero. */
@Injectable()
export class ListGuayacanCommissionsUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(input: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedGuayacanCommissions> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new GuayacanInvalidDateError();
    }
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    return this.repository.findCommissions({
      startDate: input.startDate,
      endDate: input.endDate,
      page,
      limit,
    });
  }
}
