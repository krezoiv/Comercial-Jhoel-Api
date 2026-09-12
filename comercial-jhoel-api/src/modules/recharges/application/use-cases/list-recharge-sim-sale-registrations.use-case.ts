import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import type { RechargeSimSaleRegistrationRepository } from '../../domain/repositories/recharge-sim-sale-registration.repository';
import {
  PaginatedRechargeSimSaleRegistrationsOutput,
  toRechargeSimSaleRegistrationOutput,
} from '../dtos/recharge-sim-sale-registration-output';

export interface ListRechargeSimSaleRegistrationsInput {
  startDate?: string;
  endDate?: string;
  simTypeId?: string;
  isVoided?: boolean;
  page?: number;
  limit?: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/** "Administrar Ventas de SIM" listing — same pagination shape as `ListPurchasesUseCase`. */
@Injectable()
export class ListRechargeSimSaleRegistrationsUseCase {
  constructor(
    @Inject(RECHARGE_SIM_SALE_REGISTRATION_REPOSITORY)
    private readonly registrationRepository: RechargeSimSaleRegistrationRepository,
  ) {}

  async execute(
    input: ListRechargeSimSaleRegistrationsInput,
  ): Promise<PaginatedRechargeSimSaleRegistrationsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0 ? Math.min(input.limit, MAX_LIMIT) : DEFAULT_LIMIT;

    const result = await this.registrationRepository.findAll({
      startDate: input.startDate,
      endDate: input.endDate,
      simTypeId: input.simTypeId,
      isVoided: input.isVoided,
      page,
      limit,
    });

    return {
      items: result.items.map(toRechargeSimSaleRegistrationOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
