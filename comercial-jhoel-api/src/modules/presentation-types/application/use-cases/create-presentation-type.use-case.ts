import { Inject, Injectable } from '@nestjs/common';
import { PRESENTATION_TYPE_REPOSITORY } from '../../domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../domain/repositories/presentation-type.repository';
import { PresentationTypeNameAlreadyExistsError } from '../../domain/errors/presentation-type-name-already-exists.error';
import { PresentationTypeCodeAlreadyExistsError } from '../../domain/errors/presentation-type-code-already-exists.error';
import {
  PresentationTypeOutput,
  toPresentationTypeOutput,
} from '../dtos/presentation-type-output';

export interface CreatePresentationTypeInput {
  name: string;
  code?: string;
  description?: string;
  createdBy: string;
}

/**
 * The frontend is expected to check `GET /presentation-types?search=&includeInactive=true`
 * before calling this, and offer "Activar" instead of "Crear" when an
 * inactive match already exists (see the plan's own reasoning for why this
 * lives in the frontend rather than a special error shape). This use case
 * still rejects an inactive duplicate rather than silently reactivating it
 * — a direct API call that skips that UX gets a clear, safe error instead
 * of an unexpected side effect.
 */
@Injectable()
export class CreatePresentationTypeUseCase {
  constructor(
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(
    input: CreatePresentationTypeInput,
  ): Promise<PresentationTypeOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');
    const code = input.code?.trim().replace(/\s+/g, ' ') || null;
    const description =
      input.description?.trim().replace(/\s+/g, ' ') || null;

    const existingByName = await this.presentationTypeRepository.findByName(
      name,
    );
    if (existingByName) {
      throw new PresentationTypeNameAlreadyExistsError(
        name,
        !existingByName.isActive,
      );
    }

    if (code) {
      const existingByCode =
        await this.presentationTypeRepository.findByActiveCode(code);
      if (existingByCode) {
        throw new PresentationTypeCodeAlreadyExistsError(code);
      }
    }

    const presentationType = await this.presentationTypeRepository.create({
      name,
      code,
      description,
      createdBy: input.createdBy,
    });

    return toPresentationTypeOutput(presentationType);
  }
}
