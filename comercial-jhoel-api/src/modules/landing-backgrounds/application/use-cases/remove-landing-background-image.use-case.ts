import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundNotFoundError } from '../../domain/errors/landing-background-not-found.error';

@Injectable()
export class RemoveLandingBackgroundImageUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const background = await this.landingBackgroundRepository.findById(id);
    if (!background) {
      throw new LandingBackgroundNotFoundError(id);
    }
    await this.landingBackgroundRepository.removeImage(id, userId);
  }
}
