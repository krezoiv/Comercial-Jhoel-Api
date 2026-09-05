import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { InvalidSaleQuantityError } from '../../domain/errors/invalid-sale-quantity.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface AdjustSaleItemInput {
  userId: string;
  productId: string;
  /** Omit to resolve the product's base "Unidad" presentation / "Vitrina" location server-side. */
  presentationId?: string;
  quantityDelta: number;
  /** Which of the caller's (possibly several) open receipts this targets. */
  draftKey: string;
}

/**
 * Real-time counterpart to `CreateSaleUseCase` — called once per cart action
 * (add, +/-, direct edit, remove) instead of once at the end, so
 * `products.stock` reflects the receipt being built immediately. All the
 * actual validation (product exists/active, enough stock, row locking)
 * happens inside `adjust_sale_item()` in Postgres; this use case only
 * rejects the one thing that's cheap and meaningless to send to the DB at
 * all — a delta of exactly 0.
 */
@Injectable()
export class AdjustSaleItemUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(input: AdjustSaleItemInput): Promise<SaleOutput> {
    if (!Number.isInteger(input.quantityDelta) || input.quantityDelta === 0) {
      throw new InvalidSaleQuantityError(input.productId);
    }

    const sale = await this.saleRepository.adjustItem({
      userId: input.userId,
      productId: input.productId,
      presentationId: input.presentationId,
      quantityDelta: input.quantityDelta,
      draftKey: input.draftKey,
    });

    return toSaleOutput(sale);
  }
}
