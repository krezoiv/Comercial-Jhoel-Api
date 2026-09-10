import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseEmptyError } from '../../domain/errors/purchase-empty.error';
import { InvalidPurchaseQuantityError } from '../../domain/errors/invalid-purchase-quantity.error';
import { InvalidPurchasePriceError } from '../../domain/errors/invalid-purchase-price.error';
import { InvalidPurchaseDateError } from '../../domain/errors/invalid-purchase-date.error';
import { InvalidPaymentDataError } from '../../domain/errors/invalid-payment-data.error';
import { PurchaseOutput, toPurchaseOutput } from '../dtos/purchase-output';

export interface CreatePurchaseItemInput {
  productId: string;
  /** Omit to purchase in the product's base "Unidad" — the conversion factor is always resolved server-side. */
  presentationId?: string;
  quantity: number;
  costPrice: number;
  publicPrice: number;
}

export interface CreatePurchaseInput {
  supplierId: string;
  userId: string;
  purchaseDate: Date;
  items: CreatePurchaseItemInput[];
  paymentType: 'CONTADO' | 'CREDITO';
  /** `yyyy-MM-dd` — required when `paymentType` is `'CREDITO'`. */
  paymentDueDate?: string;
  /** Free-text folio from the supplier's own invoice — optional, never enforced as unique. */
  invoiceNumber?: string;
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

    // Defense in depth alongside the DTO's own `@ValidateIf` — a
    // TypeScript-only caller (e.g. a future internal script) never gets a
    // chance to skip this by bypassing the HTTP layer.
    if (input.paymentType === 'CREDITO' && !input.paymentDueDate) {
      throw new InvalidPaymentDataError(
        'Debe indicar la fecha de pago para una compra a crédito.',
      );
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidPurchaseQuantityError(item.productId);
      }
      if (item.costPrice < 0 || item.publicPrice < 0) {
        throw new InvalidPurchasePriceError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same
    // product+presentation twice — merge into one line (summing quantity)
    // rather than letting confirm_purchase() create two purchase_details
    // rows for it. Keyed by (productId, presentationId) rather than just
    // productId — "2 Cajas" and "5 Unidades" of the same product are
    // legitimately separate lines, not duplicates. The frontend's own
    // "same product added again" rule already prevents this in normal use;
    // this is the backend's independent safety net. If two entries somehow
    // disagree on price, the last one wins — deterministic, and not a
    // real-world case a well-behaved client ever produces.
    const mergedByLine = new Map<
      string,
      {
        productId: string;
        presentationId?: string;
        quantity: number;
        costPrice: number;
        publicPrice: number;
      }
    >();
    for (const item of input.items) {
      const key = `${item.productId}:${item.presentationId ?? ''}`;
      const existing = mergedByLine.get(key);
      mergedByLine.set(key, {
        productId: item.productId,
        presentationId: item.presentationId,
        quantity: (existing?.quantity ?? 0) + item.quantity,
        costPrice: item.costPrice,
        publicPrice: item.publicPrice,
      });
    }

    // Sorted by productId so concurrent multi-item purchases always lock
    // shared products in the same order — rules out lock-ordering deadlocks
    // between two confirm_purchase() calls, same reasoning as CreateSaleUseCase.
    const items = [...mergedByLine.values()].sort((a, b) =>
      a.productId.localeCompare(b.productId),
    );

    const purchase = await this.purchaseRepository.confirmPurchase({
      supplierId: input.supplierId,
      userId: input.userId,
      purchaseDate: input.purchaseDate,
      items,
      paymentType: input.paymentType,
      paymentDueDate:
        input.paymentType === 'CREDITO' ? input.paymentDueDate : undefined,
      invoiceNumber: input.invoiceNumber?.trim() || undefined,
    });

    return toPurchaseOutput(purchase);
  }
}
