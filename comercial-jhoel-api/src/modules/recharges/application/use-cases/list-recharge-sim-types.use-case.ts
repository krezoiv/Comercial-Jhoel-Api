import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SIM_TYPE_REPOSITORY } from '../../domain/repositories/recharge-sim-type.repository';
import type { RechargeSimTypeRepository } from '../../domain/repositories/recharge-sim-type.repository';
import {
  RechargeSimTypeOutput,
  toRechargeSimTypeOutput,
} from '../dtos/recharge-sim-type-output';

@Injectable()
export class ListRechargeSimTypesUseCase {
  constructor(
    @Inject(RECHARGE_SIM_TYPE_REPOSITORY)
    private readonly rechargeSimTypeRepository: RechargeSimTypeRepository,
  ) {}

  async execute(): Promise<RechargeSimTypeOutput[]> {
    const types = await this.rechargeSimTypeRepository.findAll({
      activeOnly: true,
    });
    return types.map(toRechargeSimTypeOutput);
  }
}
