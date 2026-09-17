import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CatalogPhone } from '../../domain/entities/catalog-phone.entity';
import { CatalogPhoneImage } from '../../domain/entities/catalog-phone-image.entity';
import {
  AddCatalogPhoneImageData,
  CatalogPhoneImageBytes,
  CatalogPhoneRepository,
  CreateCatalogPhoneData,
  ListCatalogPhonesOptions,
  ReorderCatalogPhoneItem,
  UpdateCatalogPhoneData,
} from '../../domain/repositories/catalog-phone.repository';
import { CatalogPhoneOrmEntity } from './catalog-phone.orm-entity';
import { CatalogPhoneImageOrmEntity } from './catalog-phone-image.orm-entity';
import { CatalogPhoneMapper } from './catalog-phone.mapper';
import { CatalogPhoneImageMapper } from './catalog-phone-image.mapper';

/** Columns of `catalog_phone_images` safe to load in bulk — deliberately excludes `image.imageData` (BYTEA), so listing N phones with M photos each never pulls every photo's raw bytes into memory. Only `getImage()` reads the bytes, one row at a time. */
const IMAGE_LIST_COLUMNS = [
  'image.id',
  'image.catalogPhoneId',
  'image.mimeType',
  'image.sizeBytes',
  'image.isPrimary',
  'image.sortOrder',
  'image.createdBy',
  'image.createdAt',
];

@Injectable()
export class TypeOrmCatalogPhoneRepository implements CatalogPhoneRepository {
  constructor(
    @InjectRepository(CatalogPhoneOrmEntity)
    private readonly repository: Repository<CatalogPhoneOrmEntity>,
    @InjectRepository(CatalogPhoneImageOrmEntity)
    private readonly imageRepository: Repository<CatalogPhoneImageOrmEntity>,
  ) {}

  private baseQuery(): SelectQueryBuilder<CatalogPhoneOrmEntity> {
    return this.repository
      .createQueryBuilder('phone')
      .leftJoinAndSelect('phone.createdByUser', 'createdByUser')
      .leftJoinAndSelect('phone.updatedByUser', 'updatedByUser')
      .leftJoin('phone.images', 'image')
      .addSelect(IMAGE_LIST_COLUMNS)
      .orderBy('image.sortOrder', 'ASC');
  }

  async findAll(options?: ListCatalogPhonesOptions): Promise<CatalogPhone[]> {
    const query = this.baseQuery();
    if (!options?.includeInactive) {
      query.andWhere('phone.isActive = true');
    }
    if (options?.search) {
      query.andWhere(
        '(phone.brand ILIKE :search OR phone.model ILIKE :search)',
        {
          search: `%${options.search}%`,
        },
      );
    }
    query
      .addOrderBy('phone.sortOrder', 'ASC')
      .addOrderBy('phone.createdAt', 'DESC');
    const orms = await query.getMany();
    return orms.map((orm) => CatalogPhoneMapper.toDomain(orm));
  }

  async findById(id: string): Promise<CatalogPhone | null> {
    const orm = await this.baseQuery()
      .andWhere('phone.id = :id', { id })
      .getOne();
    return orm ? CatalogPhoneMapper.toDomain(orm) : null;
  }

  async findPublished(): Promise<CatalogPhone[]> {
    const orms = await this.baseQuery()
      .andWhere('phone.isPublished = true')
      .andWhere('phone.isActive = true')
      .addOrderBy('phone.sortOrder', 'ASC')
      .getMany();
    return orms.map((orm) => CatalogPhoneMapper.toDomain(orm));
  }

  async create(data: CreateCatalogPhoneData): Promise<CatalogPhone> {
    const orm = this.repository.create({
      brand: data.brand,
      model: data.model,
      description: data.description,
      price: data.price,
      screen: data.screen,
      ram: data.ram,
      storage: data.storage,
      camera: data.camera,
      battery: data.battery,
      processor: data.processor,
      operatingSystem: data.operatingSystem,
      extraSpecs: data.extraSpecs,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);

    return withRelations!;
  }

  async update(
    id: string,
    data: UpdateCatalogPhoneData,
  ): Promise<CatalogPhone> {
    const patch: Partial<CatalogPhoneOrmEntity> = { updatedBy: data.updatedBy };
    if (data.brand !== undefined) patch.brand = data.brand;
    if (data.model !== undefined) patch.model = data.model;
    if (data.description !== undefined) patch.description = data.description;
    if (data.price !== undefined) patch.price = data.price;
    if (data.screen !== undefined) patch.screen = data.screen;
    if (data.ram !== undefined) patch.ram = data.ram;
    if (data.storage !== undefined) patch.storage = data.storage;
    if (data.camera !== undefined) patch.camera = data.camera;
    if (data.battery !== undefined) patch.battery = data.battery;
    if (data.processor !== undefined) patch.processor = data.processor;
    if (data.operatingSystem !== undefined)
      patch.operatingSystem = data.operatingSystem;
    if (data.extraSpecs !== undefined) patch.extraSpecs = data.extraSpecs;

    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);

    return updated!;
  }

  async setActive(
    id: string,
    isActive: boolean,
    updatedBy: string,
  ): Promise<void> {
    await this.repository.update({ id }, { isActive, updatedBy });
  }

  async setPublished(
    id: string,
    isPublished: boolean,
    updatedBy: string,
  ): Promise<void> {
    await this.repository.update({ id }, { isPublished, updatedBy });
  }

  async reorder(items: ReorderCatalogPhoneItem[]): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      for (const item of items) {
        await manager.update(
          CatalogPhoneOrmEntity,
          { id: item.id },
          {
            sortOrder: item.sortOrder,
          },
        );
      }
    });
  }

  async listImages(catalogPhoneId: string): Promise<CatalogPhoneImage[]> {
    const orms = await this.imageRepository.find({
      where: { catalogPhoneId },
      select: {
        id: true,
        catalogPhoneId: true,
        mimeType: true,
        sizeBytes: true,
        isPrimary: true,
        sortOrder: true,
        createdBy: true,
        createdAt: true,
      },
      order: { sortOrder: 'ASC' },
    });
    return orms.map((orm) => CatalogPhoneImageMapper.toDomain(orm));
  }

  async addImage(data: AddCatalogPhoneImageData): Promise<CatalogPhoneImage> {
    const orm = this.imageRepository.create({
      catalogPhoneId: data.catalogPhoneId,
      imageData: data.imageData,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      isPrimary: data.isPrimary,
      sortOrder: data.sortOrder,
      createdBy: data.createdBy,
    });
    const saved = await this.imageRepository.save(orm);
    return CatalogPhoneImageMapper.toDomain(saved);
  }

  async removeImage(catalogPhoneId: string, imageId: string): Promise<void> {
    await this.imageRepository.delete({ id: imageId, catalogPhoneId });
  }

  async setPrimaryImage(
    catalogPhoneId: string,
    imageId: string,
  ): Promise<void> {
    await this.imageRepository.manager.transaction(async (manager) => {
      await manager.update(
        CatalogPhoneImageOrmEntity,
        { catalogPhoneId, isPrimary: true },
        { isPrimary: false },
      );
      await manager.update(
        CatalogPhoneImageOrmEntity,
        { id: imageId },
        { isPrimary: true },
      );
    });
  }

  async getImage(imageId: string): Promise<CatalogPhoneImageBytes | null> {
    const orm = await this.imageRepository.findOne({ where: { id: imageId } });
    if (!orm) {
      return null;
    }
    return {
      data: orm.imageData,
      mimeType: orm.mimeType,
      catalogPhoneId: orm.catalogPhoneId,
    };
  }
}
