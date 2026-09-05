import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type { QuotationRepository } from '../../domain/repositories/quotation.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { QuotationEmptyError } from '../../domain/errors/quotation-empty.error';
import { InvalidQuotationQuantityError } from '../../domain/errors/invalid-quotation-quantity.error';
import { InvalidQuotationDiscountError } from '../../domain/errors/invalid-quotation-discount.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { InvalidExpirationDateError } from '../../domain/errors/invalid-expiration-date.error';
import { QuotationOutput, toQuotationOutput } from '../dtos/quotation-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface CreateQuotationItemInput {
  productId: string;
  quantity: number;
  discount?: number;
}

export interface CreateQuotationInput {
  userId: string;
  clientId: string;
  expirationDate: string;
  observations?: string | null;
  commercialTerms?: string | null;
  items: CreateQuotationItemInput[];
}

/**
 * A Cotización is explicitly NOT a sale — `create_quotation()` never touches
 * `products.stock`/`inventory_stock`/`inventory_movements`, and every line
 * is historicized at creation time. Structurally mirrors
 * `CreateTicketUseCase`'s own validation/dedup shape, with the additions
 * this document type requires: a mandatory client, a required expiration
 * date validated against today, and a per-line discount.
 */
@Injectable()
export class CreateQuotationUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: QuotationRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateQuotationInput): Promise<QuotationOutput> {
    if (!input.items || input.items.length === 0) {
      throw new QuotationEmptyError();
    }

    const client = await this.clientRepository.findById(input.clientId);
    if (!client || !client.isActive) {
      throw new InvalidClientError();
    }

    if (input.expirationDate < todayIsoDate()) {
      throw new InvalidExpirationDateError();
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidQuotationQuantityError(item.productId);
      }
      if (item.discount != null && item.discount < 0) {
        throw new InvalidQuotationDiscountError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same product
    // twice — merge into one line rather than letting create_quotation()
    // insert two quotation_details rows for it. Same reasoning as
    // CreateSaleUseCase/CreateTicketUseCase. Discounts for merged entries
    // are summed alongside their quantities.
    const mergedByProduct = new Map<
      string,
      { quantity: number; discount: number }
    >();
    for (const item of input.items) {
      const existing = mergedByProduct.get(item.productId);
      mergedByProduct.set(item.productId, {
        quantity: (existing?.quantity ?? 0) + item.quantity,
        discount: (existing?.discount ?? 0) + (item.discount ?? 0),
      });
    }

    const items = [...mergedByProduct.entries()]
      .map(([productId, { quantity, discount }]) => ({
        productId,
        quantity,
        discount,
      }))
      .sort((a, b) => a.productId.localeCompare(b.productId));

    const quotation = await this.quotationRepository.createQuotation({
      userId: input.userId,
      clientId: input.clientId,
      expirationDate: input.expirationDate,
      observations: input.observations ?? null,
      commercialTerms: input.commercialTerms ?? null,
      items,
    });

    return toQuotationOutput(quotation);
  }
}
