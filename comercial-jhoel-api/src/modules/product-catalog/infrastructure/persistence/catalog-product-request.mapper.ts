import { CatalogProductRequest } from '../../domain/entities/catalog-product-request.entity';
import { CatalogProductRequestOrmEntity } from './catalog-product-request.orm-entity';

export class CatalogProductRequestMapper {
  static toDomain(orm: CatalogProductRequestOrmEntity): CatalogProductRequest {
    return CatalogProductRequest.create({
      id: orm.id,
      catalogProductId: orm.catalogProductId,
      productName: orm.productName,
      price: orm.price,
      customerName: orm.customerName,
      customerPhone: orm.customerPhone,
      status: orm.status,
      observation: orm.observation,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
