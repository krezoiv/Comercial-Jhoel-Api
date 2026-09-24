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
import { SectionAlreadyHasActiveBackgroundError } from '../../domain/errors/section-already-has-active-background.error';
import { LandingBackgroundOutput, toLandingBackgroundOutput } from '../dtos/landing-background-output';

export interface CreateLandingBackgroundInput {
  name: string;
  sectionKey: LandingSectionKey;
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
export class CreateLandingBackgroundUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(input: CreateLandingBackgroundInput): Promise<LandingBackgroundOutput> {
    const existing = await this.landingBackgroundRepository.findActiveBySectionKey(input.sectionKey);
    if (existing) {
      throw new SectionAlreadyHasActiveBackgroundError(input.sectionKey);
    }

    const background = await this.landingBackgroundRepository.create({
      name: input.name.trim(),
      sectionKey: input.sectionKey,
      opacity: input.opacity,
      overlay: input.overlay,
      position: input.position,
      size: input.size,
      depthEffect: input.depthEffect,
      parallax: input.parallax,
      movement: input.movement,
      createdBy: input.userId,
    });
    return toLandingBackgroundOutput(background);
  }
}
