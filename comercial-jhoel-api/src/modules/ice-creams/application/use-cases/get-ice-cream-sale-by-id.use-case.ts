import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_SALE_REPOSITORY } from '../../domain/repositories/ice-cream-sale.repository';
import type { IceCreamSaleRepository } from '../../domain/repositories/ice-cream-sale.repository';
import { IceCreamSaleNotFoundError } from '../../domain/errors/ice-cream-sale-not-found.error';
import { IceCreamSaleAccessDeniedError } from '../../domain/errors/ice-cream-sale-access-denied.error';
import {
  IceCreamSaleOutput,
  toIceCreamSaleOutput,
} from '../dtos/ice-cream-sale-output';

export interface GetIceCreamSaleByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetIceCreamSaleByIdUseCase {
  constructor(
    @Inject(ICE_CREAM_SALE_REPOSITORY)
    private readonly iceCreamSaleRepository: IceCreamSaleRepository,
  ) {}

  async execute(
    id: string,
    input: GetIceCreamSaleByIdInput,
  ): Promise<IceCreamSaleOutput> {
    const sale = await this.iceCreamSaleRepository.findById(id);
    if (!sale) {
      throw new IceCreamSaleNotFoundError(id);
    }

    if (!input.isAdmin && sale.userId !== input.currentUserId) {
      throw new IceCreamSaleAccessDeniedError();
    }

    return toIceCreamSaleOutput(sale);
  }
}
