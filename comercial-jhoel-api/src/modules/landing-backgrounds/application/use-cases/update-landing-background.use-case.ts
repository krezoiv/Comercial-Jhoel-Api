import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingSectionKey } from '../../domain/constants/landing-section-key';
import {
  BackgroundPosition,
  BackgroundSize,
  DepthEffect,
  MovementMode,
  OverlayLevel,
  ParallaxIntensity,
} from '../../domain/constants/visual-config';
import { LandingBackgroundNotFoundError } from '../../domain/errors/landing-background-not-found.error';
import { SectionAlreadyHasActiveBackgroundError } from '../../domain/errors/section-already-has-active-background.error';
import { LandingBackgroundOutput, toLandingBackgroundOutput } from '../dtos/landing-background-output';

export interface UpdateLandingBackgroundInput {
  name?: string;
  sectionKey?: LandingSectionKey;
  opacity?: number;
  overlay?: OverlayLevel;
  position?: BackgroundPosition;
  size?: BackgroundSize;
  depthEffect?: DepthEffect;
  parallax?: ParallaxIntensity;
  movement?: MovementMode;
  userId: string;
}

@Injectable()
export class UpdateLandingBackgroundUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(id: string, input: UpdateLandingBackgroundInput): Promise<LandingBackgroundOutput> {
    const existing = await this.landingBackgroundRepository.findById(id);
    if (!existing) {
      throw new LandingBackgroundNotFoundError(id);
    }

    // Moving an active background to a different section needs the same
    // one-active-per-section guarantee `CreateLandingBackgroundUseCase`
    // already enforces — never assume the new section is free.
    if (
      existing.isActive &&
      input.sectionKey !== undefined &&
      input.sectionKey !== existing.sectionKey
    ) {
      const conflict = await this.landingBackgroundRepository.findActiveBySectionKey(input.sectionKey);
      if (conflict) {
        throw new SectionAlreadyHasActiveBackgroundError(input.sectionKey);
      }
    }

    const updated = await this.landingBackgroundRepository.update(id, {
      name: input.name?.trim(),
      sectionKey: input.sectionKey,
      opacity: input.opacity,
      overlay: input.overlay,
      position: input.position,
      size: input.size,
      depthEffect: input.depthEffect,
      parallax: input.parallax,
      movement: input.movement,
      updatedBy: input.userId,
    });
    return toLandingBackgroundOutput(updated);
  }
}
