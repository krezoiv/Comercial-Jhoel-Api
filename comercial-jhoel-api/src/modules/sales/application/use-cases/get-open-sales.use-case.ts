import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

/** Backs `GET /sales/current` — lets the frontend restore every in-progress receipt (one per open tab) after a page reload/navigation. An empty array is a normal, valid state (no open tabs), never an error. */
@Injectable()
export class GetOpenSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(userId: string): Promise<SaleOutput[]> {
    const sales = await this.saleRepository.findOpenSalesByUserId(userId);
    return sales.map(toSaleOutput);
  }
}
