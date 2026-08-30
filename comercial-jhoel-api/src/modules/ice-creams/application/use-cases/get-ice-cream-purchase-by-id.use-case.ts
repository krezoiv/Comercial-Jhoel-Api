import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_PURCHASE_REPOSITORY } from '../../domain/repositories/ice-cream-purchase.repository';
import type { IceCreamPurchaseRepository } from '../../domain/repositories/ice-cream-purchase.repository';
import { IceCreamPurchaseNotFoundError } from '../../domain/errors/ice-cream-purchase-not-found.error';
import { IceCreamPurchaseAccessDeniedError } from '../../domain/errors/ice-cream-purchase-access-denied.error';
import {
  IceCreamPurchaseOutput,
  toIceCreamPurchaseOutput,
} from '../dtos/ice-cream-purchase-output';

export interface GetIceCreamPurchaseByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetIceCreamPurchaseByIdUseCase {
  constructor(
    @Inject(ICE_CREAM_PURCHASE_REPOSITORY)
    private readonly iceCreamPurchaseRepository: IceCreamPurchaseRepository,
  ) {}

  async execute(
    id: string,
    input: GetIceCreamPurchaseByIdInput,
  ): Promise<IceCreamPurchaseOutput> {
    const purchase = await this.iceCreamPurchaseRepository.findById(id);
    if (!purchase) {
      throw new IceCreamPurchaseNotFoundError(id);
    }

    if (!input.isAdmin && purchase.userId !== input.currentUserId) {
      throw new IceCreamPurchaseAccessDeniedError();
    }

    return toIceCreamPurchaseOutput(purchase);
  }
}
