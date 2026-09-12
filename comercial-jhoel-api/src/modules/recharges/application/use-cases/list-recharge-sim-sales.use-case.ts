import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REPOSITORY } from '../../domain/repositories/recharge-sim-sale.repository';
import type { RechargeSimSaleRepository } from '../../domain/repositories/recharge-sim-sale.repository';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargeSimSaleOutput,
  toRechargeSimSaleOutput,
} from '../dtos/recharge-sim-sale-output';

/** Backs "Administrar Ventas de SIM (por cantidad)" — every by-quantity "Vender SIM" sale for the given date (identity-registration sales are excluded, see the repository's own doc comment), newest first, voided included (shown, never hidden). */
@Injectable()
export class ListRechargeSimSalesUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REPOSITORY)
    private readonly simSaleRepository: RechargeSimSaleRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(date: string = todayIsoDate()): Promise<RechargeSimSaleOutput[]> {
    assertValidOperationDate(date);
    const [sales, dayOpening] = await Promise.all([
      this.simSaleRepository.findAllByDate(date),
      this.dayOpeningRepository.findByDate(date),
    ]);
    const dayClosed = dayOpening?.closedAt != null;
    return sales.map((sale) => toRechargeSimSaleOutput(sale, dayClosed));
  }
}
