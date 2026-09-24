import { LandingBackground } from '../../domain/entities/landing-background.entity';
import { LandingBackgroundOrmEntity } from './landing-background.orm-entity';

export class LandingBackgroundMapper {
  static toDomain(orm: LandingBackgroundOrmEntity): LandingBackground {
    return LandingBackground.create({
      id: orm.id,
      name: orm.name,
      sectionKey: orm.sectionKey,
      opacity: orm.opacity,
      overlay: orm.overlay,
      position: orm.position,
      size: orm.size,
      depthEffect: orm.depthEffect,
      parallax: orm.parallax,
      movement: orm.movement,
      isActive: orm.isActive,
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
