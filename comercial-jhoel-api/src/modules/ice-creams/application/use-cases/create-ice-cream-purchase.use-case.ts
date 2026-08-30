import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_PURCHASE_REPOSITORY } from '../../domain/repositories/ice-cream-purchase.repository';
import type { IceCreamPurchaseRepository } from '../../domain/repositories/ice-cream-purchase.repository';
import { IceCreamPurchaseEmptyError } from '../../domain/errors/ice-cream-purchase-empty.error';
import { InvalidIceCreamQuantityError } from '../../domain/errors/invalid-ice-cream-quantity.error';
import { InvalidIceCreamPriceError } from '../../domain/errors/invalid-ice-cream-price.error';
import { InvalidIceCreamPurchaseDateError } from '../../domain/errors/invalid-ice-cream-purchase-date.error';
import {
  IceCreamPurchaseOutput,
  toIceCreamPurchaseOutput,
} from '../dtos/ice-cream-purchase-output';

export interface CreateIceCreamPurchaseItemInput {
  iceCreamId: string;
  quantity: number;
  costPrice: number;
}

export interface CreateIceCreamPurchaseInput {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: CreateIceCreamPurchaseItemInput[];
}

// Same grace window as CreatePurchaseUseCase — see that file's own doc
// comment for why: absorbs client/server clock and timezone skew around
// "today" without rejecting a perfectly valid same-day selection.
const FUTURE_DATE_GRACE_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CreateIceCreamPurchaseUseCase {
  constructor(
    @Inject(ICE_CREAM_PURCHASE_REPOSITORY)
    private readonly iceCreamPurchaseRepository: IceCreamPurchaseRepository,
  ) {}

  async execute(
    input: CreateIceCreamPurchaseInput,
  ): Promise<IceCreamPurchaseOutput> {
    if (!input.items || input.items.length === 0) {
      throw new IceCreamPurchaseEmptyError();
    }

    if (
      Number.isNaN(input.purchaseDate.getTime()) ||
      input.purchaseDate.getTime() > Date.now() + FUTURE_DATE_GRACE_MS
    ) {
      throw new InvalidIceCreamPurchaseDateError();
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidIceCreamQuantityError(item.iceCreamId);
      }
      if (item.costPrice < 0) {
        throw new InvalidIceCreamPriceError(item.iceCreamId);
      }
    }

    // Defensive dedup — same reasoning as CreatePurchaseUseCase: merge a
    // manipulated payload's repeated helado into one line (summing
    // quantity) rather than letting confirm_ice_cream_purchase() create two
    // detail rows for it.
    const mergedByIceCream = new Map<
      string,
      { quantity: number; costPrice: number }
    >();
    for (const item of input.items) {
      const existing = mergedByIceCream.get(item.iceCreamId);
      mergedByIceCream.set(item.iceCreamId, {
        quantity: (existing?.quantity ?? 0) + item.quantity,
        costPrice: item.costPrice,
      });
    }

    // Sorted by iceCreamId so concurrent multi-item purchases always lock
    // shared helados in the same order — rules out lock-ordering deadlocks,
    // same reasoning as CreatePurchaseUseCase/CreateSaleUseCase.
    const items = [...mergedByIceCream.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iceCreamId, data]) => ({ iceCreamId, ...data }));

    const purchase = await this.iceCreamPurchaseRepository.confirmPurchase({
      supplierId: input.supplierId,
      userId: input.userId,
      purchaseDate: input.purchaseDate,
      items,
    });

    return toIceCreamPurchaseOutput(purchase);
  }
}
