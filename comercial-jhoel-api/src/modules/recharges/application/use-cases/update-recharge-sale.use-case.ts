import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SALE_REPOSITORY } from '../../domain/repositories/recharge-sale.repository';
import type { RechargeSaleRepository } from '../../domain/repositories/recharge-sale.repository';
import {
  RechargeSaleOutput,
  toRechargeSaleOutput,
} from '../dtos/recharge-sale-output';

export interface UpdateRechargeSaleInput {
  id: string;
  phoneNumber: string;
  amount: number;
  userId: string;
}

/**
 * Only `phoneNumber`/`amount` are editable — the recharge type is fixed at
 * creation (see the migration's own comment on `update_recharge_sale`).
 * Whether the sale's cycle is still open is re-verified atomically inside
 * that function (locked `FOR UPDATE`), not pre-checked here — a plain
 * `findById` check here would leave the same race window
 * `register_recharge_sales_closure`'s own comment already documents for an
 * analogous case.
 */
@Injectable()
export class UpdateRechargeSaleUseCase {
  constructor(
    @Inject(RECHARGE_SALE_REPOSITORY)
    private readonly saleRepository: RechargeSaleRepository,
  ) {}

  async execute(input: UpdateRechargeSaleInput): Promise<RechargeSaleOutput> {
    const sale = await this.saleRepository.update({
      id: input.id,
      phoneNumber: input.phoneNumber,
      amount: input.amount,
      userId: input.userId,
    });

    return toRechargeSaleOutput(sale);
  }
}
