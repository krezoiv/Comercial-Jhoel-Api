import { Inject, Injectable } from '@nestjs/common';
import {
  CashBoxHistoryMovementType,
  RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY,
} from '../../domain/repositories/recharge-cash-box-movement.repository';
import type { RechargeCashBoxMovementRepository } from '../../domain/repositories/recharge-cash-box-movement.repository';
import { InvalidCashBoxDateRangeError } from '../../domain/errors/invalid-cash-box-date-range.error';
import { PaginatedCashBoxMovementsOutput } from '../dtos/cash-box-movement-output';

export interface GetCashBoxMovementsInput {
  startDate?: string;
  endDate?: string;
  type?: CashBoxHistoryMovementType;
  page?: number;
  limit?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

/** Historial de Movimientos — same pagination/date-range shape as `GetRechargeHistoryUseCase`, applied to the Caja Contable's own unified movement stream (see `TypeOrmRechargeCashBoxRepository.findMovements` for how the running "saldo" column is computed correctly regardless of which page/filter is being viewed). */
@Injectable()
export class GetCashBoxMovementsUseCase {
  constructor(
    @Inject(RECHARGE_CASH_BOX_MOVEMENT_REPOSITORY)
    private readonly cashBoxRepository: RechargeCashBoxMovementRepository,
  ) {}

  async execute(
    input: GetCashBoxMovementsInput,
  ): Promise<PaginatedCashBoxMovementsOutput> {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new InvalidCashBoxDateRangeError();
    }

    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    return this.cashBoxRepository.findMovements({
      startDate: input.startDate,
      endDate: input.endDate,
      type: input.type,
      page,
      limit,
    });
  }
}
