import { Inject, Injectable } from '@nestjs/common';
import { SALE_REPOSITORY } from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleNotFoundError } from '../../domain/errors/sale-not-found.error';
import { SaleAccessDeniedError } from '../../domain/errors/sale-access-denied.error';
import { SaleOutput, toSaleOutput } from '../dtos/sale-output';

export interface GetSaleByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetSaleByIdUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(id: string, input: GetSaleByIdInput): Promise<SaleOutput> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new SaleNotFoundError(id);
    }

    if (!input.isAdmin && sale.userId !== input.currentUserId) {
      throw new SaleAccessDeniedError();
    }

    return toSaleOutput(sale);
  }
}
