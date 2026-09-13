import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { PRODUCT_PRESENTATION_REPOSITORY } from '../../../inventory/domain/repositories/product-presentation.repository';
import type { ProductPresentationRepository } from '../../../inventory/domain/repositories/product-presentation.repository';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error';

/**
 * Soft delete only — DELETE /products/:id never removes the row. Also
 * deactivates every presentation this product owns (including "Unidad")
 * — see `ProductPresentationRepository.deactivateAllForProduct`'s own doc
 * comment for why: a product here has no reactivation path anywhere in
 * this codebase, so this is safe and is what keeps a presentation's
 * barcode actually freed up for reuse once its product is gone, the same
 * way `products.sku` already frees up on this same action.
 */
@Injectable()
export class DeactivateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_PRESENTATION_REPOSITORY)
    private readonly presentationRepository: ProductPresentationRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    await this.productRepository.deactivate(id);
    await this.presentationRepository.deactivateAllForProduct(id);
  }
}
