import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_TYPE_REPOSITORY } from '../../domain/repositories/recharge-type.repository';
import type { RechargeTypeRepository } from '../../domain/repositories/recharge-type.repository';
import {
  RechargeTypeOutput,
  toRechargeTypeOutput,
} from '../dtos/recharge-type-output';

@Injectable()
export class ListRechargeTypesUseCase {
  constructor(
    @Inject(RECHARGE_TYPE_REPOSITORY)
    private readonly rechargeTypeRepository: RechargeTypeRepository,
  ) {}

  async execute(): Promise<RechargeTypeOutput[]> {
    const types = await this.rechargeTypeRepository.findAll({
      activeOnly: true,
    });
    return types.map(toRechargeTypeOutput);
  }
}
