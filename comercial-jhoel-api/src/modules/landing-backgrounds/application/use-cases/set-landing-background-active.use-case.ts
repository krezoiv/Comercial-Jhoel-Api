import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundNotFoundError } from '../../domain/errors/landing-background-not-found.error';
import { SectionAlreadyHasActiveBackgroundError } from '../../domain/errors/section-already-has-active-background.error';

/** Soft — nunca DELETE físico. Un fondo desactivado desaparece de la landing pero conserva imagen/configuración en administración. */
@Injectable()
export class SetLandingBackgroundActiveUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(id: string, isActive: boolean, userId: string): Promise<void> {
    const background = await this.landingBackgroundRepository.findById(id);
    if (!background) {
      throw new LandingBackgroundNotFoundError(id);
    }

    if (isActive && !background.isActive) {
      const conflict = await this.landingBackgroundRepository.findActiveBySectionKey(background.sectionKey);
      if (conflict) {
        throw new SectionAlreadyHasActiveBackgroundError(background.sectionKey);
      }
    }

    await this.landingBackgroundRepository.setActive(id, isActive, userId);
  }
}
