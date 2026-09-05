import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAlreadyPaidError } from '../../domain/errors/purchase-already-paid.error';
import { PurchaseOutput, toPurchaseOutput } from '../dtos/purchase-output';

export interface MarkPurchaseAsPaidInput {
  id: string;
  paidBy: string;
}

/**
 * "Marcar como pagada" — the minimum viable payment-tracking action this
 * ticket asked for, deliberately NOT a full cuentas-por-pagar module (the
 * ticket's own "PAGO DE COMPRA" section explicitly warns against building
 * one without first analyzing the architecture — none exists yet, so this
 * stays minimal). A CONTADO purchase is already `PAID` at creation (see
 * `confirm_purchase`), so attempting to mark one paid again correctly hits
 * the same "already paid" error a second attempt on a CREDITO purchase
 * would — there's no need to special-case "this purchase was never
 * CREDITO in the first place."
 *
 * Operational (no `@Roles` at the controller) — same policy as registering
 * the purchase itself: paying a supplier is routine bookkeeping for
 * whoever manages it, not an exceptional admin correction (unlike e.g.
 * anular-ing a Transaccionar operation, which undoes a mistake).
 */
@Injectable()
export class MarkPurchaseAsPaidUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(input: MarkPurchaseAsPaidInput): Promise<PurchaseOutput> {
    const purchase = await this.purchaseRepository.findById(input.id);
    if (!purchase) {
      throw new PurchaseNotFoundError(input.id);
    }
    if (purchase.paymentStatus === 'PAID') {
      throw new PurchaseAlreadyPaidError(input.id);
    }

    const paid = await this.purchaseRepository.markAsPaid(
      input.id,
      input.paidBy,
    );
    return toPurchaseOutput(paid);
  }
}
