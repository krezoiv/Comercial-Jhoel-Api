import { CatalogRequest } from '../../domain/entities/catalog-request.entity';
import { CatalogRequestOrmEntity } from './catalog-request.orm-entity';

export class CatalogRequestMapper {
  static toDomain(orm: CatalogRequestOrmEntity): CatalogRequest {
    return CatalogRequest.create({
      id: orm.id,
      catalogPhoneId: orm.catalogPhoneId,
      brand: orm.brand,
      model: orm.model,
      price: orm.price,
      creditAvailable: orm.creditAvailable,
      requestType: orm.requestType,
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
