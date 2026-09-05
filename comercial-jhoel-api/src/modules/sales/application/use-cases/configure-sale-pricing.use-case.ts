import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { PriceListType } from '../../domain/entities/sale.entity';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface ConfigureSalePricingInput {
  userId: string;
  clientId: string | null;
  priceList: PriceListType;
  draftKey: string;
}

/**
 * Sets/updates the caller's in-progress receipt's client and price list —
 * called once, at the start of a sale (before or while the cart is still
 * empty). `clientId` is validated here (exists + active) the same way
 * `CreateProductUseCase` validates `categoryId`/`businessId`, so an invalid
 * client never reaches the SQL layer; the price-list lock (once the receipt
 * has line items) is enforced inside `configure_open_sale()` itself, since
 * that check has to run atomically against the same row this function locks.
 */
@Injectable()
export class ConfigureSalePricingUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: ConfigureSalePricingInput): Promise<SaleOutput> {
    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client || !client.isActive) {
        throw new InvalidClientError();
      }
    }

    const sale = await this.saleRepository.configureOpenSale({
      userId: input.userId,
      clientId: input.clientId,
      priceList: input.priceList,
      draftKey: input.draftKey,
    });

    return toSaleOutput(sale);
  }
}
