import { RechargeSimType } from '../entities/recharge-sim-type.entity';

export const RECHARGE_SIM_TYPE_REPOSITORY = Symbol(
  'RECHARGE_SIM_TYPE_REPOSITORY',
);

export interface RechargeSimTypeRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<RechargeSimType[]>;
  findById(id: string): Promise<RechargeSimType | null>;
}
