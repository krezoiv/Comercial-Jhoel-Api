import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../domain/repositories/product-presentation.repository';
import { PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository';
import type { ProductRepository } from '../../../products/domain/repositories/product.repository';
import { ProductNotFoundError } from '../../../products/domain/errors/product-not-found.error';
import {
  ProductPresentationOutput,
  toProductPresentationOutput,
} from '../dtos/inventory-output';

@Injectable()
export class ListProductPresentationsUseCase {
  constructor(
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productId: string): Promise<ProductPresentationOutput[]> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId);
    }
    const presentations =
      await this.presentationRepository.findByProductId(productId);
    return presentations.map(toProductPresentationOutput);
  }
}
