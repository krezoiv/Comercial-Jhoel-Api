import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_REPOSITORY } from '../../domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../domain/repositories/ice-cream.repository';
import { IceCreamNotFoundError } from '../../domain/errors/ice-cream-not-found.error';
import { IceCreamNameAlreadyExistsError } from '../../domain/errors/ice-cream-name-already-exists.error';
import { IceCreamSkuAlreadyExistsError } from '../../domain/errors/ice-cream-sku-already-exists.error';
import { IceCreamOutput, toIceCreamOutput } from '../dtos/ice-cream-output';

export interface UpdateIceCreamInput {
  sku?: string;
  product?: string;
  costPrice?: number;
  publicPrice?: number;
  updatedBy: string;
}

@Injectable()
export class UpdateIceCreamUseCase {
  constructor(
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateIceCreamInput,
  ): Promise<IceCreamOutput> {
    const iceCream = await this.iceCreamRepository.findById(id);
    if (!iceCream) {
      throw new IceCreamNotFoundError(id);
    }

    const product = input.product?.trim().replace(/\s+/g, ' ');
    if (product && product !== iceCream.product) {
      const existing =
        await this.iceCreamRepository.findByActiveProduct(product);
      if (existing) {
        throw new IceCreamNameAlreadyExistsError(product);
      }
    }

    const sku = input.sku?.trim();
    if (sku && sku !== iceCream.sku) {
      const existing = await this.iceCreamRepository.findByActiveSku(sku);
      if (existing) {
        throw new IceCreamSkuAlreadyExistsError(sku);
      }
    }

    const updated = await this.iceCreamRepository.update(id, {
      ...(product ? { product } : {}),
      ...(sku ? { sku } : {}),
      ...(input.costPrice !== undefined ? { costPrice: input.costPrice } : {}),
      ...(input.publicPrice !== undefined
        ? { publicPrice: input.publicPrice }
        : {}),
      updatedBy: input.updatedBy,
    });

    return toIceCreamOutput(updated);
  }
}
