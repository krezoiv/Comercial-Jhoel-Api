import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SALE_REPOSITORY } from '../../domain/repositories/recharge-sale.repository';
import type { RechargeSaleRepository } from '../../domain/repositories/recharge-sale.repository';
import { todayIsoDate } from '../utils/today-iso-date';
import { assertValidOperationDate } from '../utils/assert-valid-operation-date';
import {
  RechargeSaleOutput,
  toRechargeSaleOutput,
} from '../dtos/recharge-sale-output';

/** Backs the "Recargas Vendidas" table — every sale recorded under each type's CURRENT cycle for the given date, newest first. */
@Injectable()
export class GetRechargeSalesUseCase {
  constructor(
    @Inject(RECHARGE_SALE_REPOSITORY)
    private readonly saleRepository: RechargeSaleRepository,
  ) {}

  async execute(date: string = todayIsoDate()): Promise<RechargeSaleOutput[]> {
    assertValidOperationDate(date);
    const sales = await this.saleRepository.findAllByDate(date);
    return sales.map(toRechargeSaleOutput);
  }
}
