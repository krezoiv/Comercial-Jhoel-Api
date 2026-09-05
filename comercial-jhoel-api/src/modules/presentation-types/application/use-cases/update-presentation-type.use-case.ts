import { Inject, Injectable } from '@nestjs/common';
import { PRESENTATION_TYPE_REPOSITORY } from '../../domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../domain/repositories/presentation-type.repository';
import { PresentationTypeNotFoundError } from '../../domain/errors/presentation-type-not-found.error';
import { PresentationTypeNameAlreadyExistsError } from '../../domain/errors/presentation-type-name-already-exists.error';
import { PresentationTypeCodeAlreadyExistsError } from '../../domain/errors/presentation-type-code-already-exists.error';
import {
  PresentationTypeOutput,
  toPresentationTypeOutput,
} from '../dtos/presentation-type-output';

export interface UpdatePresentationTypeInput {
  name?: string;
  code?: string | null;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

/** `isActive` toggling both ways lives here (unlike `account_types`/`categories`, which only ever deactivate via `DELETE`) — this catalog explicitly needs reactivation (ver el plan). */
@Injectable()
export class UpdatePresentationTypeUseCase {
  constructor(
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdatePresentationTypeInput,
  ): Promise<PresentationTypeOutput> {
    const presentationType = await this.presentationTypeRepository.findById(
      id,
    );
    if (!presentationType) {
      throw new PresentationTypeNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name.toLowerCase() !== presentationType.name.toLowerCase()) {
      const existing = await this.presentationTypeRepository.findByName(
        name,
      );
      if (existing) {
        throw new PresentationTypeNameAlreadyExistsError(
          name,
          !existing.isActive,
        );
      }
    }

    const code =
      input.code !== undefined
        ? input.code?.trim().replace(/\s+/g, ' ') || null
        : undefined;
    if (code && code.toLowerCase() !== presentationType.code?.toLowerCase()) {
      const existing = await this.presentationTypeRepository.findByActiveCode(
        code,
      );
      if (existing) {
        throw new PresentationTypeCodeAlreadyExistsError(code);
      }
    }

    const description =
      input.description !== undefined
        ? input.description?.trim().replace(/\s+/g, ' ') || null
        : undefined;

    const updated = await this.presentationTypeRepository.update(id, {
      ...(name ? { name } : {}),
      ...(code !== undefined ? { code } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      updatedBy: input.updatedBy,
    });

    return toPresentationTypeOutput(updated);
  }
}
