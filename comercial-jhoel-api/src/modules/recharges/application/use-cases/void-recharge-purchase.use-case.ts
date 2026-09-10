import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_PURCHASE_REPOSITORY } from '../../domain/repositories/recharge-purchase.repository';
import type { RechargePurchaseRepository } from '../../domain/repositories/recharge-purchase.repository';
import { RechargePurchaseNotFoundError } from '../../domain/errors/recharge-purchase-not-found.error';
import { RechargePurchaseAlreadyVoidedError } from '../../domain/errors/recharge-purchase-already-voided.error';
import { VoidReasonRequiredError } from '../../domain/errors/void-reason-required.error';
import {
  RechargePurchaseOutput,
  toRechargePurchaseOutput,
} from '../dtos/recharge-purchase-output';

export interface VoidRechargePurchaseInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * "Revertir compra" — the correction path for a mistaken recharge purchase
 * (wrong operator, duplicate, wrong amount). Never an edit, never a
 * physical delete — the original row stays exactly as registered, forever,
 * marked `ANULADA`. The real guard order (not-found → already-voided →
 * day-closed → cycle-closed → would-go-negative) runs atomically inside
 * `void_recharge_purchase`'s own advisory row lock — this use case only
 * pre-checks reason/existence for a clean error message and translates
 * the result; a TypeScript-side pre-check of the closed-cycle/negative-
 * balance rules would only add a TOCTOU gap, not close one (same
 * reasoning already established for the Kardex financiero payment use
 * cases and Caja Contable's withdrawal use case).
 */
@Injectable()
export class VoidRechargePurchaseUseCase {
  constructor(
    @Inject(RECHARGE_PURCHASE_REPOSITORY)
    private readonly purchaseRepository: RechargePurchaseRepository,
  ) {}

  async execute(
    input: VoidRechargePurchaseInput,
  ): Promise<RechargePurchaseOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new VoidReasonRequiredError();
    }

    const purchase = await this.purchaseRepository.findById(input.id);
    if (!purchase) {
      throw new RechargePurchaseNotFoundError();
    }
    if (purchase.isVoided) {
      throw new RechargePurchaseAlreadyVoidedError();
    }

    const voided = await this.purchaseRepository.voidPurchase(
      input.id,
      input.voidedBy,
      reason,
    );
    return toRechargePurchaseOutput(voided);
  }
}
