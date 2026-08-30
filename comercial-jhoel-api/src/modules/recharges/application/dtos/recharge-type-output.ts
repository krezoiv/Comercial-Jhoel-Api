import { RechargeType } from '../../domain/entities/recharge-type.entity';

export interface RechargeTypeOutput {
  id: string;
  name: string;
  isActive: boolean;
}

export function toRechargeTypeOutput(type: RechargeType): RechargeTypeOutput {
  return {
    id: type.id,
    name: type.name,
    isActive: type.isActive,
  };
}
