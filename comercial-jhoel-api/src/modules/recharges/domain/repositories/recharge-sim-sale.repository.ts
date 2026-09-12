import { RechargeSimSale } from '../entities/recharge-sim-sale.entity';

export const RECHARGE_SIM_SALE_REPOSITORY = Symbol('RECHARGE_SIM_SALE_REPOSITORY');

export interface RechargeSimSaleRepository {
  findAllByDate(date: string): Promise<RechargeSimSale[]>;
  findById(id: string): Promise<RechargeSimSale | null>;
  /** Invokes `void_recharge_sim_sale` — validates and reverts (restores stock) atomically. */
  voidSale(id: string, voidedBy: string, reason: string): Promise<RechargeSimSale>;
}
