import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type {
  QuotationRepository,
  QuotationSalePreviewLine,
  QuotationStatusAction,
} from '../../domain/repositories/quotation.repository';
import { QuotationNotFoundError } from '../../domain/errors/quotation-not-found.error';
import { QuotationAccessDeniedError } from '../../domain/errors/quotation-access-denied.error';
import { Quotation } from '../../domain/entities/quotation.entity';
import { QuotationOutput, toQuotationOutput } from '../dtos/quotation-output';

export interface QuotationActor {
  currentUserId: string;
  isAdmin: boolean;
}

/** Same ownership rule as GetQuotationByIdUseCase: a non-admin acts only on their own quotations. */
async function loadOwned(
  repository: QuotationRepository,
  id: string,
  actor: QuotationActor,
): Promise<Quotation> {
  const quotation = await repository.findById(id);
  if (!quotation) {
    throw new QuotationNotFoundError(id);
  }
  if (!actor.isAdmin && quotation.userId !== actor.currentUserId) {
    throw new QuotationAccessDeniedError();
  }
  return quotation;
}

/** Confirmar borrador / Aceptar / Rechazar — commercial status only, never inventory. */
@Injectable()
export class ChangeQuotationStatusUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly repository: QuotationRepository,
  ) {}

  async execute(
    id: string,
    action: Exclude<QuotationStatusAction, 'CANCELAR'>,
    reason: string | null,
    actor: QuotationActor,
  ): Promise<QuotationOutput> {
    await loadOwned(this.repository, id, actor);
    const updated = await this.repository.changeStatus(
      id,
      action,
      actor.currentUserId,
      reason,
    );
    return toQuotationOutput(updated);
  }
}

/** Summary shown before "Confirmar venta": quoted lines with the current Vitrina stock. */
@Injectable()
export class GetQuotationSalePreviewUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly repository: QuotationRepository,
  ) {}

  async execute(
    id: string,
    actor: QuotationActor,
  ): Promise<{
    quotation: QuotationOutput;
    lines: QuotationSalePreviewLine[];
    canConfirm: boolean;
  }> {
    const quotation = toQuotationOutput(
      await loadOwned(this.repository, id, actor),
    );
    const lines = await this.repository.salePreview(id);
    return {
      quotation,
      lines,
      canConfirm:
        (quotation.status === 'COTIZADA' || quotation.status === 'ACEPTADA') &&
        lines.length > 0 &&
        lines.every((line) => line.sufficient),
    };
  }
}

/**
 * "Confirmar venta": converts the quotation into ONE sale through the
 * existing Ventas function (`confirm_sale`, Vitrina stock, movements), with
 * the quoted prices, in one PostgreSQL transaction. Calling it again (double
 * click, retry) returns the same sale without discounting stock twice.
 */
@Injectable()
export class ConvertQuotationToSaleUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly repository: QuotationRepository,
  ) {}

  async execute(
    id: string,
    actor: QuotationActor,
  ): Promise<{ saleId: string; quotation: QuotationOutput }> {
    await loadOwned(this.repository, id, actor);
    const saleId = await this.repository.convertToSale(id, actor.currentUserId);
    const quotation = await this.repository.findById(id);
    return { saleId, quotation: toQuotationOutput(quotation!) };
  }
}
