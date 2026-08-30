import { Inject, Injectable } from '@nestjs/common';
import { PURCHASE_REPOSITORY } from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import { PurchaseNotFoundError } from '../../domain/errors/purchase-not-found.error';
import { PurchaseAccessDeniedError } from '../../domain/errors/purchase-access-denied.error';
import { PurchaseOutput, toPurchaseOutput } from '../dtos/purchase-output';

export interface GetPurchaseByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetPurchaseByIdUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(
    id: string,
    input: GetPurchaseByIdInput,
  ): Promise<PurchaseOutput> {
    const purchase = await this.purchaseRepository.findById(id);
    if (!purchase) {
      throw new PurchaseNotFoundError(id);
    }

    if (!input.isAdmin && purchase.userId !== input.currentUserId) {
      throw new PurchaseAccessDeniedError();
    }

    return toPurchaseOutput(purchase);
  }
}
