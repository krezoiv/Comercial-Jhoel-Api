import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_PURCHASE_REPOSITORY } from '../../domain/repositories/recharge-purchase.repository';
import type { RechargePurchaseRepository } from '../../domain/repositories/recharge-purchase.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargePurchaseOutput,
  toRechargePurchaseOutput,
} from '../dtos/recharge-purchase-output';

/** Backs the "Compras de Recargas" table — every purchase recorded under each type's CURRENT cycle for the given date, newest first, voided included (shown, never hidden). */
@Injectable()
export class GetRechargePurchasesUseCase {
  constructor(
    @Inject(RECHARGE_PURCHASE_REPOSITORY)
    private readonly purchaseRepository: RechargePurchaseRepository,
  ) {}

  async execute(
    date: string = todayIsoDate(),
  ): Promise<RechargePurchaseOutput[]> {
    assertValidOperationDate(date);
    const purchases = await this.purchaseRepository.findAllByDate(date);
    return purchases.map(toRechargePurchaseOutput);
  }
}
