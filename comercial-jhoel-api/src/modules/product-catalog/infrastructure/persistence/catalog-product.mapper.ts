import { CatalogProduct } from '../../domain/entities/catalog-product.entity';
import { CatalogProductOrmEntity } from './catalog-product.orm-entity';

export class CatalogProductMapper {
  static toDomain(orm: CatalogProductOrmEntity): CatalogProduct {
    return CatalogProduct.create({
      id: orm.id,
      productId: orm.productId,
      section: orm.section,
      catalogDescription: orm.catalogDescription,
      hasImage: orm.imageMimeType !== null,
      isActive: orm.isActive,
      sortOrder: orm.sortOrder,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
      productName: orm.product?.name ?? '',
      productPrice: orm.product?.publicPrice ?? 0,
      productIsActive: orm.product?.isActive ?? false,
      categoryName: orm.product?.category?.name ?? '',
      businessName: orm.product?.business?.name ?? '',
      unitOfMeasureAbbreviation: orm.product?.unitOfMeasure?.abbreviation ?? null,
    });
  }
}
