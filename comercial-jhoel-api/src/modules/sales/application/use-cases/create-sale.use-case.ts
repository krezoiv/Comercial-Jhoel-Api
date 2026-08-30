import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleEmptyError } from '../../domain/errors/sale-empty.error';
import { InvalidSaleQuantityError } from '../../domain/errors/invalid-sale-quantity.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface CreateSaleItemInput {
  productId: string;
  quantity: number;
}

export interface CreateSaleInput {
  userId: string;
  items: CreateSaleItemInput[];
}

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(input: CreateSaleInput): Promise<SaleOutput> {
    if (!input.items || input.items.length === 0) {
      throw new SaleEmptyError();
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidSaleQuantityError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same product
    // twice — merge into one line rather than letting confirm_sale() create
    // two sale_details rows (and lock/decrement the same product twice).
    const mergedByProduct = new Map<string, number>();
    for (const item of input.items) {
      mergedByProduct.set(
        item.productId,
        (mergedByProduct.get(item.productId) ?? 0) + item.quantity,
      );
    }

    // Sorted by productId so concurrent multi-item sales always lock shared
    // products in the same order — this is what rules out deadlocks between
    // two confirm_sale() calls that both touch the same two products.
    const items = [...mergedByProduct.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([productId, quantity]) => ({ productId, quantity }));

    const sale = await this.saleRepository.confirmSale({
      userId: input.userId,
      items,
    });

    return toSaleOutput(sale);
  }
}
