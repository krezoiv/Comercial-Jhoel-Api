import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_SALE_REPOSITORY } from '../../domain/repositories/ice-cream-sale.repository';
import type { IceCreamSaleRepository } from '../../domain/repositories/ice-cream-sale.repository';
import { IceCreamSaleEmptyError } from '../../domain/errors/ice-cream-sale-empty.error';
import { InvalidIceCreamQuantityError } from '../../domain/errors/invalid-ice-cream-quantity.error';
import {
  IceCreamSaleOutput,
  toIceCreamSaleOutput,
} from '../dtos/ice-cream-sale-output';

export interface CreateIceCreamSaleItemInput {
  iceCreamId: string;
  quantity: number;
}

export interface CreateIceCreamSaleInput {
  userId: string;
  items: CreateIceCreamSaleItemInput[];
}

@Injectable()
export class CreateIceCreamSaleUseCase {
  constructor(
    @Inject(ICE_CREAM_SALE_REPOSITORY)
    private readonly iceCreamSaleRepository: IceCreamSaleRepository,
  ) {}

  async execute(input: CreateIceCreamSaleInput): Promise<IceCreamSaleOutput> {
    if (!input.items || input.items.length === 0) {
      throw new IceCreamSaleEmptyError();
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidIceCreamQuantityError(item.iceCreamId);
      }
    }

    // Defensive dedup — same reasoning as CreateIceCreamPurchaseUseCase:
    // merge a manipulated payload's repeated helado into one line (summing
    // quantity) rather than letting confirm_ice_cream_sale() create two
    // detail rows for it. The frontend's own "same product added again"
    // rule already prevents this in normal use.
    const mergedByIceCream = new Map<string, number>();
    for (const item of input.items) {
      mergedByIceCream.set(
        item.iceCreamId,
        (mergedByIceCream.get(item.iceCreamId) ?? 0) + item.quantity,
      );
    }

    // Sorted by iceCreamId so concurrent multi-item sales always lock
    // shared helados in the same order — rules out lock-ordering deadlocks,
    // same reasoning as CreateSaleUseCase/CreateIceCreamPurchaseUseCase.
    const items = [...mergedByIceCream.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iceCreamId, quantity]) => ({ iceCreamId, quantity }));

    const sale = await this.iceCreamSaleRepository.confirmSale({
      userId: input.userId,
      items,
    });

    return toIceCreamSaleOutput(sale);
  }
}
