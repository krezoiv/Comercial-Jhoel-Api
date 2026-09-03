import { RechargeSimType } from '../../domain/entities/recharge-sim-type.entity';

export interface RechargeSimTypeOutput {
  id: string;
  name: string;
  costPrice: number;
  publicPrice: number;
  isActive: boolean;
}

export function toRechargeSimTypeOutput(
  type: RechargeSimType,
): RechargeSimTypeOutput {
  return {
    id: type.id,
    name: type.name,
    costPrice: type.costPrice,
    publicPrice: type.publicPrice,
    isActive: type.isActive,
  };
}
