import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundNotVisibleError } from '../../domain/errors/landing-background-not-visible.error';

export interface LandingBackgroundImageBytesOutput {
  data: Buffer;
  mimeType: string;
}

/** Único endpoint que sirve los bytes — reutilizado tanto por la landing pública (la capa visual) como por la vista previa/miniaturas del admin, igual que el resto de módulos con imagen de este proyecto. */
@Injectable()
export class GetLandingBackgroundImageUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(id: string): Promise<LandingBackgroundImageBytesOutput> {
    const image = await this.landingBackgroundRepository.getImage(id);
    if (!image) {
      throw new LandingBackgroundNotVisibleError();
    }
    return image;
  }
}
