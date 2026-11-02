import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashMovementType,
  PaginatedGuayacanCashMovements,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanInvalidDateError } from '../../domain/errors/guayacan-cash-box.errors';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/** Kardex paginado en SQL, más reciente primero. */
@Injectable()
export class ListGuayacanCashMovementsUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  execute(input: {
    startDate?: string;
    endDate?: string;
    movementType?: GuayacanCashMovementType;
    page?: number;
    limit?: number;
  }): Promise<PaginatedGuayacanCashMovements> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new GuayacanInvalidDateError();
    }
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;
    return this.repository.findMovements({
      startDate: input.startDate,
      endDate: input.endDate,
      movementType: input.movementType,
      page,
      limit,
    });
  }
}
