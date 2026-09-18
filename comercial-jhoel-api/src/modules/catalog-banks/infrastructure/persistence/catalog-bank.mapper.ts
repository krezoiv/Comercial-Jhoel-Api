import { CatalogBank } from '../../domain/entities/catalog-bank.entity';
import { CatalogBankOrmEntity } from './catalog-bank.orm-entity';

export class CatalogBankMapper {
  static toDomain(orm: CatalogBankOrmEntity): CatalogBank {
    return CatalogBank.create({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      additionalInfo: orm.additionalInfo,
      isActive: orm.isActive,
      sortOrder: orm.sortOrder,
      hasImage: orm.imageMimeType !== null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? orm.createdByUser?.name ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? orm.updatedByUser?.name ?? null,
    });
  }
}
