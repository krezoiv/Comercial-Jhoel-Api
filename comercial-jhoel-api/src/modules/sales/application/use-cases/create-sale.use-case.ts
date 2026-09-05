import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { PriceListType } from '../../domain/entities/sale.entity';
import { SaleEmptyError } from '../../domain/errors/sale-empty.error';
import { InvalidSaleQuantityError } from '../../domain/errors/invalid-sale-quantity.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface CreateSaleItemInput {
  productId: string;
  /** Omit to sell in the product's base "Unidad" — the conversion factor and Vitrina stock are always resolved server-side. */
  presentationId?: string;
  quantity: number;
}

export interface CreateSaleInput {
  userId: string;
  items: CreateSaleItemInput[];
  clientId?: string | null;
  priceList?: PriceListType;
}

@Injectable()
export class CreateSaleUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateSaleInput): Promise<SaleOutput> {
    if (!input.items || input.items.length === 0) {
      throw new SaleEmptyError();
    }

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client || !client.isActive) {
        throw new InvalidClientError();
      }
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidSaleQuantityError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same
    // product+presentation twice — merge into one line rather than letting
    // confirm_sale() create two sale_details rows (and lock/decrement the
    // same product twice). Keyed by (productId, presentationId), same
    // reasoning as CreatePurchaseUseCase — different presentations of the
    // same product are legitimately separate lines.
    const mergedByLine = new Map<
      string,
      { productId: string; presentationId?: string; quantity: number }
    >();
    for (const item of input.items) {
      const key = `${item.productId}:${item.presentationId ?? ''}`;
      const existing = mergedByLine.get(key);
      mergedByLine.set(key, {
        productId: item.productId,
        presentationId: item.presentationId,
        quantity: (existing?.quantity ?? 0) + item.quantity,
      });
    }

    // Sorted by productId so concurrent multi-item sales always lock shared
    // products in the same order — this is what rules out deadlocks between
    // two confirm_sale() calls that both touch the same two products.
    const items = [...mergedByLine.values()].sort((a, b) =>
      a.productId.localeCompare(b.productId),
    );

    const sale = await this.saleRepository.confirmSale({
      userId: input.userId,
      items,
      clientId: input.clientId,
      priceList: input.priceList,
    });

    return toSaleOutput(sale);
  }
}
