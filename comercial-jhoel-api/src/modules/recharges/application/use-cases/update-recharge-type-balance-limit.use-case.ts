import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_TYPE_REPOSITORY } from '../../domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import { InvalidBalanceLimitError } from '../../domain/errors/invalid-balance-limit.error';
import {
  RechargeTypeOutput,
  toRechargeTypeOutput,
} from '../dtos/recharge-type-output';

export interface UpdateRechargeTypeBalanceLimitInput {
  id: string;
  balanceLimit: number;
}

/**
 * "Límite de saldo" per recharge type — the 100% reference point the
 * Resumen dashboard's saldo gauge charts compare the current balance
 * against. Admin-only.
 */
@Injectable()
export class UpdateRechargeTypeBalanceLimitUseCase {
  constructor(
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
  ) {}

  async execute(
    input: UpdateRechargeTypeBalanceLimitInput,
  ): Promise<RechargeTypeOutput> {
    if (input.balanceLimit < 0) {
      throw new InvalidBalanceLimitError();
    }

    const updated = await this.rechargeTypeRepository.updateBalanceLimit(
      input.id,
      input.balanceLimit,
    );
    return toRechargeTypeOutput(updated);
  }
}
