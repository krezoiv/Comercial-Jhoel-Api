import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { ProductNotFoundError } from '../../domain/errors/product-not-found.error';
import { ProductNameAlreadyExistsError } from '../../domain/errors/product-name-already-exists.error';
import { ProductSkuAlreadyExistsError } from '../../domain/errors/product-sku-already-exists.error';
import { InvalidCategoryError } from '../../domain/errors/invalid-category.error';
import { InvalidBusinessError } from '../../domain/errors/invalid-business.error';
import { ProductOutput, toProductOutput } from '../dtos/product-output';

export interface UpdateProductInput {
  name?: string;
  sku?: string | null;
  categoryId?: string;
  businessId?: string;
  costPrice?: number;
  publicPrice?: number;
  wholesalePrice?: number;
  stock?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(id: string, input: UpdateProductInput): Promise<ProductOutput> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category || !category.isActive) {
        throw new InvalidCategoryError();
      }
    }

    if (input.businessId) {
      const business = await this.businessRepository.findById(input.businessId);
      if (!business || !business.isActive) {
        throw new InvalidBusinessError();
      }
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name !== product.name) {
      const existing = await this.productRepository.findByActiveName(name);
      if (existing) {
        throw new ProductNameAlreadyExistsError(name);
      }
    }

    const sku = input.sku !== undefined ? input.sku?.trim() || null : undefined;
    if (sku && sku !== product.sku) {
      const existingSku = await this.productRepository.findByActiveSku(sku);
      if (existingSku) {
        throw new ProductSkuAlreadyExistsError(sku);
      }
    }

    const updated = await this.productRepository.update(id, {
      ...(name ? { name } : {}),
      ...(sku !== undefined ? { sku } : {}),
      ...(input.categoryId ? { categoryId: input.categoryId } : {}),
      ...(input.businessId ? { businessId: input.businessId } : {}),
      ...(input.costPrice !== undefined ? { costPrice: input.costPrice } : {}),
      ...(input.publicPrice !== undefined
        ? { publicPrice: input.publicPrice }
        : {}),
      ...(input.wholesalePrice !== undefined
        ? { wholesalePrice: input.wholesalePrice }
        : {}),
      ...(input.stock !== undefined ? { stock: input.stock } : {}),
    });

    return toProductOutput(updated);
  }
}
