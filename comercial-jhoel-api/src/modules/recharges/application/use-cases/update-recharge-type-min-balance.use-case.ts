import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_TYPE_REPOSITORY } from '../../domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { InvalidMinBalanceError } from '../../domain/errors/invalid-min-balance.error';
import {
  RechargeTypeOutput,
  toRechargeTypeOutput,
} from '../dtos/recharge-type-output';

export interface UpdateRechargeTypeMinBalanceInput {
  id: string;
  minBalance: number;
}

/**
 * "Saldo mínimo" per recharge type — the threshold the Alerts module reads
 * for "saldo bajo de recargas". Admin-only.
 */
@Injectable()
export class UpdateRechargeTypeMinBalanceUseCase {
  constructor(
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
  ) {}

  async execute(
    input: UpdateRechargeTypeMinBalanceInput,
  ): Promise<RechargeTypeOutput> {
    if (input.minBalance < 0) {
      throw new InvalidMinBalanceError();
    }

    const updated = await this.rechargeTypeRepository.updateMinBalance(
      input.id,
      input.minBalance,
    );
    return toRechargeTypeOutput(updated);
  }
}
