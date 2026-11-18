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
import { quotationRuleError } from '../../domain/errors/quotation-rule.error';
import { QuotationOutput, toQuotationOutput } from '../dtos/quotation-output';
import { todayIsoDate } from '../utils/today-iso-date';

export interface CreateQuotationItemInput {
  productId: string;
  quantity: number;
  discount?: number;
}

export interface CreateQuotationInput {
  userId: string;
  /** Legacy: a registered client. New quotations send the typed-in customer fields. */
  clientId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  studentName?: string | null;
  grade?: string | null;
  asDraft?: boolean;
  expirationDate: string;
  observations?: string | null;
  commercialTerms?: string | null;
  items: CreateQuotationItemInput[];
}

const PHONE = /^[+0-9 ()-]{8,20}$/;

/**
 * Creates a Cotización for a customer typed in by hand (no `clients` row is
 * created) or, for backwards compatibility, a registered client. Saving a
 * quotation NEVER touches inventory — `create_quotation` writes only the
 * quotation and its lines; stock moves only on "Confirmar venta".
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

    const clientId = input.clientId ?? null;
    if (clientId) {
      const client = await this.clientRepository.findById(clientId);
      if (!client || !client.isActive) {
        throw new InvalidClientError();
      }
    } else {
      const name = input.customerName?.trim() ?? '';
      const phone = input.customerPhone?.trim() ?? '';
      if (name.length < 3 || name.length > 150) {
        throw quotationRuleError('QUOTATION_INVALID_CUSTOMER_NAME');
      }
      if (!PHONE.test(phone) || phone.replace(/\D/g, '').length < 8) {
        throw quotationRuleError('QUOTATION_INVALID_PHONE');
      }
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

    // Defensive dedup: one line per product (quantities and discounts summed).
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
      clientId,
      customer: clientId
        ? null
        : {
            name: input.customerName!.trim(),
            phone: input.customerPhone!.trim(),
            studentName: input.studentName?.trim() || null,
            grade: input.grade?.trim() || null,
          },
      asDraft: input.asDraft ?? false,
      expirationDate: input.expirationDate,
      observations: input.observations ?? null,
      commercialTerms: input.commercialTerms ?? null,
      items,
    });

    return toQuotationOutput(quotation);
  }
}
