import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/repositories/category.repository';
import type { CategoryRepository } from '../../../categories/domain/repositories/category.repository';
import { BUSINESS_REPOSITORY } from '../../../businesses/domain/repositories/business.repository';
import type { BusinessRepository } from '../../../businesses/domain/repositories/business.repository';
import { ProductNameAlreadyExistsError } from '../../domain/errors/product-name-already-exists.error';
import { ProductSkuAlreadyExistsError } from '../../domain/errors/product-sku-already-exists.error';
import { InvalidCategoryError } from '../../domain/errors/invalid-category.error';
import { InvalidBusinessError } from '../../domain/errors/invalid-business.error';
import { ProductOutput, toProductOutput } from '../dtos/product-output';

export interface CreateProductInput {
  name: string;
  sku?: string;
  categoryId: string;
  businessId: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    // Referenced-entity validation runs before the uniqueness checks below
    // — a product pointing at a deleted/deactivated category or business
    // is a data-integrity problem worth catching before spending a query
    // on name/SKU uniqueness, which only matters once the FKs are known
    // to be valid.
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category || !category.isActive) {
      throw new InvalidCategoryError();
    }

    const business = await this.businessRepository.findById(input.businessId);
    if (!business || !business.isActive) {
      throw new InvalidBusinessError();
    }

    const existing = await this.productRepository.findByActiveName(name);
    if (existing) {
      throw new ProductNameAlreadyExistsError(name);
    }

    // `sku` is genuinely optional (a barcode a product may not have yet) —
    // an empty/blank value is normalized to `null` rather than an empty
    // string, matching the partial unique index (`UQ_products_sku_active`)
    // that only enforces uniqueness among non-null, active rows.
    const sku = input.sku?.trim() || null;
    if (sku) {
      const existingSku = await this.productRepository.findByActiveSku(sku);
      if (existingSku) {
        throw new ProductSkuAlreadyExistsError(sku);
      }
    }

    const product = await this.productRepository.create({
      name,
      sku,
      categoryId: input.categoryId,
      businessId: input.businessId,
      costPrice: input.costPrice,
      publicPrice: input.publicPrice,
      wholesalePrice: input.wholesalePrice,
      stock: input.stock,
    });

    return toProductOutput(product);
  }
}
