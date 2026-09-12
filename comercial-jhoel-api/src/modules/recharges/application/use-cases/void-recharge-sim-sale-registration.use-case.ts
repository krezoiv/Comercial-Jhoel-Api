import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { SimSaleRegistrationNotFoundError } from '../../domain/errors/sim-sale-registration-not-found.error';
import { SimSaleRegistrationAlreadyVoidedError } from '../../domain/errors/sim-sale-registration-already-voided.error';
import { SimSaleRegistrationVoidReasonRequiredError } from '../../domain/errors/sim-sale-registration-void-reason-required.error';
import {
  RechargeSimSaleRegistrationOutput,
  toRechargeSimSaleRegistrationOutput,
} from '../dtos/recharge-sim-sale-registration-output';

export interface VoidRechargeSimSaleRegistrationInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * "Anular" — the only correction path for a mistaken SIM sale registration,
 * same "nunca editar" rule as Purchases/Sales/Bank Deposits. Restores the
 * parent sale's stock atomically (`void_recharge_sim_sale_registration`),
 * which is also what makes this excluded from Total Recaudado on the very
 * next read (`register_recharge_sales_closure` only sums `is_voided =
 * false` rows).
 */
@Injectable()
export class VoidRechargeSimSaleRegistrationUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RechargeSimSaleRegistrationRepository,
  ) {}

  async execute(
    input: VoidRechargeSimSaleRegistrationInput,
  ): Promise<RechargeSimSaleRegistrationOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new SimSaleRegistrationVoidReasonRequiredError();
    }

    const registration = await this.registrationRepository.findById(input.id);
    if (!registration) {
      throw new SimSaleRegistrationNotFoundError(input.id);
    }
    if (registration.isVoided) {
      throw new SimSaleRegistrationAlreadyVoidedError(input.id);
    }

    const voided = await this.registrationRepository.voidRegistration(
      input.id,
      input.voidedBy,
      reason,
    );
    return toRechargeSimSaleRegistrationOutput(voided);
  }
}
