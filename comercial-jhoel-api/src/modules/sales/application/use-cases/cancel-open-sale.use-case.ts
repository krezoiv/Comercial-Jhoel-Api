import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { NoOpenSaleError } from '../../domain/errors/no-open-sale.error';

/** Discards the caller's in-progress receipt — every reserved line's quantity is restored to stock. */
@Injectable()
export class CancelOpenSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const cancelled = await this.saleRepository.cancelOpenSale(userId);
    if (!cancelled) {
      throw new NoOpenSaleError();
    }
  }
}
