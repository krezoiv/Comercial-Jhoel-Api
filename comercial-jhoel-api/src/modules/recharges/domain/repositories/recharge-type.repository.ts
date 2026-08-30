import { RechargeType } from '../entities/recharge-type.entity';

export const RECHARGE_TYPE_REPOSITORY = Symbol('RECHARGE_TYPE_REPOSITORY');

export interface RechargeTypeRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<RechargeType[]>;
  findById(id: string): Promise<RechargeType | null>;
}
