import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseEmptyError } from '../../domain/errors/purchase-empty.error';
import { InvalidPurchaseQuantityError } from '../../domain/errors/invalid-purchase-quantity.error';
import { InvalidPurchasePriceError } from '../../domain/errors/invalid-purchase-price.error';
import { InvalidPurchaseDateError } from '../../domain/errors/invalid-purchase-date.error';
import { PurchaseOutput, toPurchaseOutput } from '../dtos/purchase-output';

export interface CreatePurchaseItemInput {
  productId: string;
  quantity: number;
  costPrice: number;
  publicPrice: number;
}

export interface CreatePurchaseInput {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: CreatePurchaseItemInput[];
}

// A purchase invoice can legitimately be dated in the past (entering an old
// paper invoice late), but never in the future — a small grace window
// absorbs client/server clock and timezone skew around "today" without
// rejecting a perfectly valid same-day selection.
const FUTURE_DATE_GRACE_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CreatePurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(input: CreatePurchaseInput): Promise<PurchaseOutput> {
    if (!input.items || input.items.length === 0) {
      throw new PurchaseEmptyError();
    }

    if (
      Number.isNaN(input.purchaseDate.getTime()) ||
      input.purchaseDate.getTime() > Date.now() + FUTURE_DATE_GRACE_MS
    ) {
      throw new InvalidPurchaseDateError();
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidPurchaseQuantityError(item.productId);
      }
      if (item.costPrice < 0 || item.publicPrice < 0) {
        throw new InvalidPurchasePriceError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same product
    // twice — merge into one line (summing quantity) rather than letting
    // confirm_purchase() create two purchase_details rows for it. The
    // frontend's own "same product added again" rule already prevents this
    // in normal use; this is the backend's independent safety net. If two
    // entries somehow disagree on price, the last one wins — deterministic,
    // and not a real-world case a well-behaved client ever produces.
    const mergedByProduct = new Map<
      string,
      { quantity: number; costPrice: number; publicPrice: number }
    >();
    for (const item of input.items) {
      const existing = mergedByProduct.get(item.productId);
      mergedByProduct.set(item.productId, {
        quantity: (existing?.quantity ?? 0) + item.quantity,
        costPrice: item.costPrice,
        publicPrice: item.publicPrice,
      });
    }

    // Sorted by productId so concurrent multi-item purchases always lock
    // shared products in the same order — rules out lock-ordering deadlocks
    // between two confirm_purchase() calls, same reasoning as CreateSaleUseCase.
    const items = [...mergedByProduct.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([productId, data]) => ({ productId, ...data }));

    const purchase = await this.purchaseRepository.confirmPurchase({
      supplierId: input.supplierId,
      userId: input.userId,
      purchaseDate: input.purchaseDate,
      items,
    });

    return toPurchaseOutput(purchase);
  }
}
