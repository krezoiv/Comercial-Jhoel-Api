import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleNotFoundError } from '../../domain/errors/sale-not-found.error';
import { SaleAlreadyVoidedError } from '../../domain/errors/sale-already-voided.error';
import { SaleVoidReasonRequiredError } from '../../domain/errors/sale-void-reason-required.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface VoidSaleInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * "Anular venta" — the only correction path for a mistaken CONFIRMED sale
 * (mirrors `VoidPurchaseUseCase`: no "editar venta" exists — the fix is
 * always anular + registrar una venta nueva y correcta). Never an edit,
 * never a physical delete: the original row stays exactly as it was,
 * marked `ANULADA` forever.
 *
 * The real guard order (reason → not-found → not-confirmed → already-
 * voided) runs atomically inside `void_sale`'s own row lock — this use case
 * only pre-checks existence/already-voided for a clean error message and
 * translates the result; a TypeScript-side pre-check would only add a
 * TOCTOU gap, not close one, same reasoning as every other stored-function-
 * backed void in this codebase.
 */
@Injectable()
export class VoidSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(input: VoidSaleInput): Promise<SaleOutput> {
    const reason = input.reason?.trim();
    if (!reason) {
      throw new SaleVoidReasonRequiredError();
    }

    const sale = await this.saleRepository.findById(input.id);
    if (!sale) {
      throw new SaleNotFoundError(input.id);
    }
    if (sale.isVoided) {
      throw new SaleAlreadyVoidedError(input.id);
    }

    const voided = await this.saleRepository.voidSale(
      input.id,
      input.voidedBy,
      reason,
    );
    return toSaleOutput(voided);
  }
}
