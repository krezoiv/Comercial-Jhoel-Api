import { Product } from '../../domain/entities/product.entity';
import { ProductOrmEntity } from './product.orm-entity';

export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): Product {
    return Product.create({
      id: orm.id,
      name: orm.name,
      sku: orm.sku,
      categoryId: orm.categoryId,
      categoryName: orm.category.name,
      businessId: orm.businessId,
      businessName: orm.business.name,
      unitOfMeasureId: orm.unitOfMeasureId,
      unitOfMeasureName: orm.unitOfMeasure?.name ?? '',
      unitOfMeasureAbbreviation: orm.unitOfMeasure?.abbreviation ?? '',
      costPrice: orm.costPrice,
      publicPrice: orm.publicPrice,
      wholesalePrice: orm.wholesalePrice,
      stock: orm.stock,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }
}
