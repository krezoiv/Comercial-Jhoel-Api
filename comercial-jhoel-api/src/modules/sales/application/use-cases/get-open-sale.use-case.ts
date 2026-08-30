import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { NoOpenSaleError } from '../../domain/errors/no-open-sale.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

/** Backs `GET /sales/current` — lets the frontend restore an in-progress receipt after a page reload/navigation. */
@Injectable()
export class GetOpenSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(userId: string): Promise<SaleOutput> {
    const sale = await this.saleRepository.findOpenSaleByUserId(userId);
    if (!sale) {
      throw new NoOpenSaleError();
    }
    return toSaleOutput(sale);
  }
}
