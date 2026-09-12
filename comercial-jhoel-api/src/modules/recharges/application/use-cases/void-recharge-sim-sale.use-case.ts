import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REPOSITORY } from '../../domain/repositories/recharge-sim-sale.repository';
import type { RechargeSimSaleRepository } from '../../domain/repositories/recharge-sim-sale.repository';
import { RechargeSimSaleNotFoundError } from '../../domain/errors/recharge-sim-sale-not-found.error';
import { SimSaleAlreadyVoidedError } from '../../domain/errors/sim-sale-already-voided.error';
import { SimSaleHasRegistrationError } from '../../domain/errors/sim-sale-has-registration.error';
import { SimSaleVoidReasonRequiredError } from '../../domain/errors/sim-sale-void-reason-required.error';
import { RECHARGE_DAY_OPENING_REPOSITORY } from '../../domain/repositories/recharge-day-opening.repository';
import type { RechargeDayOpeningRepository } from '../../domain/repositories/recharge-day-opening.repository';
import {
  RechargeSimSaleOutput,
  toRechargeSimSaleOutput,
} from '../dtos/recharge-sim-sale-output';

export interface VoidRechargeSimSaleInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * "Revertir" for the by-quantity "Vender SIM" flow — the correction path
 * this flow never had before (see the migration's own doc comment). Never
 * an edit, never a physical delete — the original row stays exactly as
 * sold, forever, marked anulada, and its stock is restored. The real guard
 * order (reason → not-found → already-voided → has-active-registration →
 * day-closed) runs atomically inside `void_recharge_sim_sale`'s own row
 * lock — this use case only pre-checks reason/existence/registration for a
 * clean error message and translates the result; a TypeScript-side
 * pre-check of the day-closed rule would only add a TOCTOU gap, not close
 * one (same reasoning already established for `VoidRechargePurchaseUseCase`).
 */
@Injectable()
export class VoidRechargeSimSaleUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REPOSITORY)
    private readonly simSaleRepository: RechargeSimSaleRepository,
    @Inject(RECHARGE_DAY_OPENING_REPOSITORY)
    private readonly dayOpeningRepository: RechargeDayOpeningRepository,
  ) {}

  async execute(input: VoidRechargeSimSaleInput): Promise<RechargeSimSaleOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new SimSaleVoidReasonRequiredError();
    }

    const sale = await this.simSaleRepository.findById(input.id);
    if (!sale) {
      throw new RechargeSimSaleNotFoundError(input.id);
    }
    if (sale.isVoided) {
      throw new SimSaleAlreadyVoidedError();
    }
    if (sale.hasActiveRegistration) {
      throw new SimSaleHasRegistrationError();
    }

    const voided = await this.simSaleRepository.voidSale(
      input.id,
      input.voidedBy,
      reason,
    );
    const dayOpening = await this.dayOpeningRepository.findByDate(voided.saleDate);
    return toRechargeSimSaleOutput(voided, dayOpening?.closedAt != null);
  }
}
