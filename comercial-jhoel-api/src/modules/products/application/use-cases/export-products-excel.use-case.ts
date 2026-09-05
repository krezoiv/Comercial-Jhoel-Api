import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { buildProductsExcel } from '../../infrastructure/excel/products-excel.builder';

export interface ExportProductsExcelInput {
  search?: string;
  categoryId?: string;
  businessId?: string;
  sortBy?: 'name' | 'costPrice' | 'publicPrice' | 'wholesalePrice' | 'stock' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  includeInactive?: boolean;
}

/**
 * A spreadsheet has no practical row-count ceiling the way a printed PDF
 * table does — this cap only exists as a defensive bound against an
 * unbounded query, not because a real Inventario is expected to approach it.
 */
const EXCEL_EXPORT_ROW_LIMIT = 5000;

@Injectable()
export class ExportProductsExcelUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: ExportProductsExcelInput): Promise<Buffer> {
    const result = await this.productRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
      categoryId: input.categoryId,
      businessId: input.businessId,
      sortBy: input.sortBy ?? 'name',
      sortDirection: input.sortDirection ?? 'asc',
      page: 1,
      limit: EXCEL_EXPORT_ROW_LIMIT,
    });

    return buildProductsExcel(
      result.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        categoryName: item.categoryName,
        businessName: item.businessName,
        unitOfMeasureAbbreviation: item.unitOfMeasureAbbreviation,
        costPrice: item.costPrice,
        publicPrice: item.publicPrice,
        wholesalePrice: item.wholesalePrice,
        stock: item.stock,
        isActive: item.isActive,
      })),
    );
  }
}
