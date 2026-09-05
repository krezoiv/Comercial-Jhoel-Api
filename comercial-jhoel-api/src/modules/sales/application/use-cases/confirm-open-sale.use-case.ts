import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

/**
 * Backs "Guardar venta" once stock is already reserved incrementally
 * (`AdjustSaleItemUseCase`) — this only flips the receipt from OPEN to
 * CONFIRMED and stamps `saleDate`. No stock changes happen here; that
 * already happened on every add/adjust call.
 */
@Injectable()
export class ConfirmOpenSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(userId: string, draftKey: string): Promise<SaleOutput> {
    const sale = await this.saleRepository.confirmOpenSale(userId, draftKey);
    return toSaleOutput(sale);
  }
}
