import { CatalogPhone } from '../../domain/entities/catalog-phone.entity';
import { CatalogPhoneOrmEntity } from './catalog-phone.orm-entity';
import { CatalogPhoneImageMapper } from './catalog-phone-image.mapper';

export class CatalogPhoneMapper {
  /** `orm.images` may be `undefined` when the query didn't request the relation (e.g. a future lightweight read) — always normalized to `[]`, never left `undefined` on the domain entity. */
  static toDomain(orm: CatalogPhoneOrmEntity): CatalogPhone {
    return CatalogPhone.create({
      id: orm.id,
      brand: orm.brand,
      model: orm.model,
      description: orm.description,
      price: orm.price,
      screen: orm.screen,
      ram: orm.ram,
      storage: orm.storage,
      camera: orm.camera,
      battery: orm.battery,
      processor: orm.processor,
      operatingSystem: orm.operatingSystem,
      extraSpecs: orm.extraSpecs ?? [],
      isActive: orm.isActive,
      isPublished: orm.isPublished,
      sortOrder: orm.sortOrder,
      likesCount: orm.likesCount,
      images: (orm.images ?? []).map((image) =>
        CatalogPhoneImageMapper.toDomain(image),
      ),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      createdBy: orm.createdBy,
      createdByUsername: orm.createdByUser?.username ?? '',
      updatedBy: orm.updatedBy,
      updatedByUsername: orm.updatedByUser?.username ?? null,
    });
  }
}
