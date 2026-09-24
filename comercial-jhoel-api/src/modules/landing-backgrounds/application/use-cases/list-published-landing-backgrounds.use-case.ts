import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { PublicLandingBackgroundOutput } from '../dtos/landing-background-output';

/**
 * Backs la capa visual de fondos en la landing — solo activos. Un fondo
 * activo sin imagen todavía subida se incluye igual (`hasImage: false`) en
 * vez de excluirse, para que la landing pueda decidir por sí misma qué
 * hacer (en la práctica: simplemente no renderizar la capa de imagen para
 * esa sección) — la fuente de verdad de qué existe es siempre el backend.
 */
@Injectable()
export class ListPublishedLandingBackgroundsUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(): Promise<PublicLandingBackgroundOutput[]> {
    const backgrounds = await this.landingBackgroundRepository.findPublished();
    return backgrounds.map((background) => ({
      id: background.id,
      sectionKey: background.sectionKey,
      hasImage: background.hasImage,
      opacity: background.opacity,
      overlay: background.overlay,
      position: background.position,
      size: background.size,
      depthEffect: background.depthEffect,
      parallax: background.parallax,
      movement: background.movement,
    }));
  }
}
