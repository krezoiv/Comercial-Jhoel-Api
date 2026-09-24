import { Inject, Injectable } from '@nestjs/common';
import { LANDING_BACKGROUND_REPOSITORY } from '../../domain/repositories/landing-background.repository';
import type { LandingBackgroundRepository } from '../../domain/repositories/landing-background.repository';
import { LandingBackgroundNotFoundError } from '../../domain/errors/landing-background-not-found.error';
import {
  assertValidLandingBackgroundImage,
  UploadedLandingBackgroundImage,
} from '../utils/assert-valid-landing-background-image';

export interface SetLandingBackgroundImageInput {
  landingBackgroundId: string;
  image: UploadedLandingBackgroundImage;
  userId: string;
}

/** También el path que usa "Reemplazar imagen" — subir una imagen nueva sobre un fondo existente no crea una fila nueva, simplemente sobreescribe los bytes de la misma (nunca rompe el `id`/la sección/la configuración visual ya guardada). */
@Injectable()
export class SetLandingBackgroundImageUseCase {
  constructor(
    @Inject(LANDING_BACKGROUND_REPOSITORY)
    private readonly landingBackgroundRepository: LandingBackgroundRepository,
  ) {}

  async execute(input: SetLandingBackgroundImageInput): Promise<void> {
    const background = await this.landingBackgroundRepository.findById(input.landingBackgroundId);
    if (!background) {
      throw new LandingBackgroundNotFoundError(input.landingBackgroundId);
    }
    assertValidLandingBackgroundImage(input.image);
    await this.landingBackgroundRepository.setImage(
      input.landingBackgroundId,
      { data: input.image.buffer, mimeType: input.image.mimetype, sizeBytes: input.image.size },
      input.userId,
    );
  }
}
