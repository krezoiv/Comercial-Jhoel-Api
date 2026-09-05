import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../domain/repositories/unit-of-measure.repository';
import { UnitOfMeasureNotFoundError } from '../../domain/errors/unit-of-measure-not-found.error';
import { UnitOfMeasureNameAlreadyExistsError } from '../../domain/errors/unit-of-measure-name-already-exists.error';
import { UnitOfMeasureAbbreviationAlreadyExistsError } from '../../domain/errors/unit-of-measure-abbreviation-already-exists.error';
import {
  UnitOfMeasureOutput,
  toUnitOfMeasureOutput,
} from '../dtos/unit-of-measure-output';

export interface UpdateUnitOfMeasureInput {
  name?: string;
  abbreviation?: string;
  description?: string | null;
  isActive?: boolean;
  updatedBy: string;
}

@Injectable()
export class UpdateUnitOfMeasureUseCase {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateUnitOfMeasureInput,
  ): Promise<UnitOfMeasureOutput> {
    const unitOfMeasure = await this.unitOfMeasureRepository.findById(id);
    if (!unitOfMeasure) {
      throw new UnitOfMeasureNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name.toLowerCase() !== unitOfMeasure.name.toLowerCase()) {
      const existing = await this.unitOfMeasureRepository.findByName(name);
      if (existing) {
        throw new UnitOfMeasureNameAlreadyExistsError(
          name,
          !existing.isActive,
        );
      }
    }

    const abbreviation = input.abbreviation?.trim().replace(/\s+/g, ' ');
    if (
      abbreviation &&
      abbreviation.toLowerCase() !== unitOfMeasure.abbreviation.toLowerCase()
    ) {
      const existing =
        await this.unitOfMeasureRepository.findByActiveAbbreviation(
          abbreviation,
        );
      if (existing) {
        throw new UnitOfMeasureAbbreviationAlreadyExistsError(abbreviation);
      }
    }

    const description =
      input.description !== undefined
        ? input.description?.trim().replace(/\s+/g, ' ') || null
        : undefined;

    const updated = await this.unitOfMeasureRepository.update(id, {
      ...(name ? { name } : {}),
      ...(abbreviation ? { abbreviation } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      updatedBy: input.updatedBy,
    });

    return toUnitOfMeasureOutput(updated);
  }
}
