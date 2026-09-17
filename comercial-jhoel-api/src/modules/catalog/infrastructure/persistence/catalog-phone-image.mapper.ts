import { CatalogPhoneImage } from '../../domain/entities/catalog-phone-image.entity';
import { CatalogPhoneImageOrmEntity } from './catalog-phone-image.orm-entity';

export class CatalogPhoneImageMapper {
  static toDomain(orm: CatalogPhoneImageOrmEntity): CatalogPhoneImage {
    return CatalogPhoneImage.create({
      id: orm.id,
      catalogPhoneId: orm.catalogPhoneId,
      mimeType: orm.mimeType,
      sizeBytes: orm.sizeBytes,
      isPrimary: orm.isPrimary,
      sortOrder: orm.sortOrder,
      createdAt: orm.createdAt,
    });
  }
}
