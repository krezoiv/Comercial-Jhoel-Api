import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_REPOSITORY } from '../../domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../domain/repositories/ice-cream.repository';
import { IceCreamNameAlreadyExistsError } from '../../domain/errors/ice-cream-name-already-exists.error';
import { IceCreamSkuAlreadyExistsError } from '../../domain/errors/ice-cream-sku-already-exists.error';
import { IceCreamOutput, toIceCreamOutput } from '../dtos/ice-cream-output';

export interface CreateIceCreamInput {
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  createdBy: string;
}

@Injectable()
export class CreateIceCreamUseCase {
  constructor(
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
  ) {}

  async execute(input: CreateIceCreamInput): Promise<IceCreamOutput> {
    const product = input.product.trim().replace(/\s+/g, ' ');
    const sku = input.sku.trim();

    const existingProduct =
      await this.iceCreamRepository.findByActiveProduct(product);
    if (existingProduct) {
      throw new IceCreamNameAlreadyExistsError(product);
    }

    const existingSku = await this.iceCreamRepository.findByActiveSku(sku);
    if (existingSku) {
      throw new IceCreamSkuAlreadyExistsError(sku);
    }

    const iceCream = await this.iceCreamRepository.create({
      sku,
      product,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
      // A new helado always starts with zero stock — stock only ever
      // increases through a registered compra, matching the ticket's own
      // rule ("El stock inicial debe ser: 0").
      stock: 0,
      createdBy: input.createdBy,
    });

    return toIceCreamOutput(iceCream);
  }
}
