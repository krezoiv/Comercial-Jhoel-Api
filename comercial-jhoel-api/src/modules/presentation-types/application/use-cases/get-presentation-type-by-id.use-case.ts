import { Inject, Injectable } from '@nestjs/common';
import { PRESENTATION_TYPE_REPOSITORY } from '../../domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../domain/repositories/presentation-type.repository';
import { PresentationTypeNotFoundError } from '../../domain/errors/presentation-type-not-found.error';
import {
  PresentationTypeOutput,
  toPresentationTypeOutput,
} from '../dtos/presentation-type-output';

@Injectable()
export class GetPresentationTypeByIdUseCase {
  constructor(
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(id: string): Promise<PresentationTypeOutput> {
    const presentationType = await this.presentationTypeRepository.findById(
      id,
    );
    if (!presentationType) {
      throw new PresentationTypeNotFoundError(id);
    }
    return toPresentationTypeOutput(presentationType);
  }
}
