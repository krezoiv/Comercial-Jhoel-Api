import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import { SimSaleRegistrationNotFoundError } from '../../domain/errors/sim-sale-registration-not-found.error';
import {
  RechargeSimSaleRegistrationOutput,
  toRechargeSimSaleRegistrationOutput,
} from '../dtos/recharge-sim-sale-registration-output';

@Injectable()
export class GetRechargeSimSaleRegistrationByIdUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RechargeSimSaleRegistrationRepository,
  ) {}

  async execute(id: string): Promise<RechargeSimSaleRegistrationOutput> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) {
      throw new SimSaleRegistrationNotFoundError(id);
    }
    return toRechargeSimSaleRegistrationOutput(registration);
  }
}
