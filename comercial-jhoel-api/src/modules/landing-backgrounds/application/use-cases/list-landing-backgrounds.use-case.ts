import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundOutput, toLandingBackgroundOutput } from '../dtos/landing-background-output';

export interface ListLandingBackgroundsInput {
  includeInactive?: boolean;
}

@Injectable()
export class ListLandingBackgroundsUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(input: ListLandingBackgroundsInput = {}): Promise<LandingBackgroundOutput[]> {
    const backgrounds = await this.landingBackgroundRepository.findAll(input);
    return backgrounds.map(toLandingBackgroundOutput);
  }
}
