import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAlreadyVoidedError } from '../../domain/errors/purchase-already-voided.error';
import { PurchaseVoidReasonRequiredError } from '../../domain/errors/purchase-void-reason-required.error';
import { PurchaseOutput, toPurchaseOutput } from '../dtos/purchase-output';

export interface VoidPurchaseInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * "Anular factura" — the only correction path for a mistaken purchase
 * (per this ticket's explicit decision: no "editar factura" that touches
 * productos/cantidades/costos — the fix is always anular + registrar una
 * compra nueva y correcta). Never an edit, never a physical delete: the
 * original row stays exactly as registered, marked `ANULADA` forever.
 *
 * The real guard order (reason → not-found → already-voided → has-payment
 * → insufficient-stock-to-revert) runs atomically inside `void_purchase`'s
 * own row locks — this use case only pre-checks existence/already-voided
 * for a clean error message and translates the result; a TypeScript-side
 * pre-check of the payment/stock rules would only add a TOCTOU gap, not
 * close one (same reasoning already established for every other
 * stored-function-backed void in this codebase).
 */
@Injectable()
export class VoidPurchaseUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(input: VoidPurchaseInput): Promise<PurchaseOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new PurchaseVoidReasonRequiredError();
    }

    const purchase = await this.purchaseRepository.findById(input.id);
    if (!purchase) {
      throw new PurchaseNotFoundError(input.id);
    }
    if (purchase.isVoided) {
      throw new PurchaseAlreadyVoidedError(input.id);
    }

    const voided = await this.purchaseRepository.voidPurchase(
      input.id,
      input.voidedBy,
      reason,
    );
    return toPurchaseOutput(voided);
  }
}
