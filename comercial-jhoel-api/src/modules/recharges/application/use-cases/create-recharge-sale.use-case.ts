import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SALE_REPOSITORY } from '../../domain/repositories/recharge-sale.repository';
import type { RechargeSaleRepository } from '../../domain/repositories/recharge-sale.repository';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargeSaleOutput,
  toRechargeSaleOutput,
} from '../dtos/recharge-sale-output';

export interface CreateRechargeSaleInput {
  rechargeTypeId: string;
  phoneNumber: string;
  amount: number;
  userId: string;
  /** `yyyy-MM-dd` — the operation-date picker's current value, not necessarily today. */
  operationDate: string;
}

/**
 * Records one customer's recharge against the CURRENT cuadre cycle for
 * `operationDate` — type/amount/phone validation, resolving (or lazily
 * creating) that cycle's row, and rejecting an already-closed day all happen
 * atomically inside `register_recharge_sale()`; this use case only shapes
 * the input/output and validates the date, same split as
 * `RegisterRechargePurchaseUseCase`.
 */
@Injectable()
export class CreateRechargeSaleUseCase {
  constructor(
    @Inject(RECHARGE_SALE_REPOSITORY)
    private readonly saleRepository: RechargeSaleRepository,
  ) {}

  async execute(input: CreateRechargeSaleInput): Promise<RechargeSaleOutput> {
    assertValidOperationDate(input.operationDate);

    const sale = await this.saleRepository.create({
      rechargeTypeId: input.rechargeTypeId,
      date: input.operationDate,
      phoneNumber: input.phoneNumber,
      amount: input.amount,
      userId: input.userId,
    });

    return toRechargeSaleOutput(sale);
  }
}
