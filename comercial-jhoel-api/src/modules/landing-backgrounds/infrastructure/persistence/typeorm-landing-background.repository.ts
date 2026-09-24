import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { LandingBackground } from '../../domain/entities/landing-background.entity';
import { LandingSectionKey } from '../../domain/constants/landing-section-key';
import {
  CreateLandingBackgroundData,
  LandingBackgroundImageBytes,
  LandingBackgroundRepository,
  ListLandingBackgroundsOptions,
  UpdateLandingBackgroundData,
} from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundOrmEntity } from './landing-background.orm-entity';
import { LandingBackgroundMapper } from './landing-background.mapper';

@Injectable()
export class TypeOrmLandingBackgroundRepository implements LandingBackgroundRepository {
  constructor(
    @InjectRepository(LandingBackgroundOrmEntity)
    private readonly repository: Repository<LandingBackgroundOrmEntity>,
  ) {}

  private baseQuery(): SelectQueryBuilder<LandingBackgroundOrmEntity> {
    return this.repository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.createdByUser', 'createdByUser')
      .leftJoinAndSelect('b.updatedByUser', 'updatedByUser');
  }

  async findAll(options?: ListLandingBackgroundsOptions): Promise<LandingBackground[]> {
    const query = this.baseQuery();
    if (!options?.includeInactive) {
      query.andWhere('b.isActive = true');
    }
    query.orderBy('b.sectionKey', 'ASC');
    const orms = await query.getMany();
    return orms.map((orm) => LandingBackgroundMapper.toDomain(orm));
  }

  async findById(id: string): Promise<LandingBackground | null> {
    const orm = await this.baseQuery().andWhere('b.id = :id', { id }).getOne();
    return orm ? LandingBackgroundMapper.toDomain(orm) : null;
  }

  async findActiveBySectionKey(sectionKey: LandingSectionKey): Promise<LandingBackground | null> {
    const orm = await this.baseQuery()
      .andWhere('b.sectionKey = :sectionKey', { sectionKey })
      .andWhere('b.isActive = true')
      .getOne();
    return orm ? LandingBackgroundMapper.toDomain(orm) : null;
  }

  async findPublished(): Promise<LandingBackground[]> {
    const orms = await this.baseQuery().andWhere('b.isActive = true').getMany();
    return orms.map((orm) => LandingBackgroundMapper.toDomain(orm));
  }

  async create(data: CreateLandingBackgroundData): Promise<LandingBackground> {
    const orm = this.repository.create({
      name: data.name,
      sectionKey: data.sectionKey,
      opacity: data.opacity,
      overlay: data.overlay,
      position: data.position,
      size: data.size,
      depthEffect: data.depthEffect,
      parallax: data.parallax,
      movement: data.movement,
      createdBy: data.createdBy,
    });
    const saved = await this.repository.save(orm);
    const withRelations = await this.findById(saved.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return withRelations!;
  }

  async update(id: string, data: UpdateLandingBackgroundData): Promise<LandingBackground> {
    const patch: Partial<LandingBackgroundOrmEntity> = { updatedBy: data.updatedBy };
    if (data.name !== undefined) {
      patch.name = data.name;
    }
    if (data.sectionKey !== undefined) {
      patch.sectionKey = data.sectionKey;
    }
    if (data.opacity !== undefined) {
      patch.opacity = data.opacity;
    }
    if (data.overlay !== undefined) {
      patch.overlay = data.overlay;
    }
    if (data.position !== undefined) {
      patch.position = data.position;
    }
    if (data.size !== undefined) {
      patch.size = data.size;
    }
    if (data.depthEffect !== undefined) {
      patch.depthEffect = data.depthEffect;
    }
    if (data.parallax !== undefined) {
      patch.parallax = data.parallax;
    }
    if (data.movement !== undefined) {
      patch.movement = data.movement;
    }
    await this.repository.update({ id }, patch);
    const updated = await this.findById(id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return updated!;
  }

  async setActive(id: string, isActive: boolean, updatedBy: string): Promise<void> {
    await this.repository.update({ id }, { isActive, updatedBy });
  }

  async setImage(
    id: string,
    image: { data: Buffer; mimeType: string; sizeBytes: number },
    updatedBy: string,
  ): Promise<void> {
    await this.repository.update(
      { id },
      {
        imageData: image.data,
        imageMimeType: image.mimeType,
        imageSizeBytes: image.sizeBytes,
        updatedBy,
      },
    );
  }

  async removeImage(id: string, updatedBy: string): Promise<void> {
    await this.repository.update(
      { id },
      { imageData: null, imageMimeType: null, imageSizeBytes: null, updatedBy },
    );
  }

  async getImage(id: string): Promise<LandingBackgroundImageBytes | null> {
    const orm = await this.repository
      .createQueryBuilder('b')
      .select(['b.id', 'b.imageData', 'b.imageMimeType'])
      .where('b.id = :id', { id })
      .getOne();
    if (!orm || !orm.imageData || !orm.imageMimeType) {
      return null;
    }
    return { data: orm.imageData, mimeType: orm.imageMimeType };
  }
}
