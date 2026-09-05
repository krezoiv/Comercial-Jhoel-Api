import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../domain/repositories/unit-of-measure.repository';
import { UnitOfMeasureNameAlreadyExistsError } from '../../domain/errors/unit-of-measure-name-already-exists.error';
import { UnitOfMeasureAbbreviationAlreadyExistsError } from '../../domain/errors/unit-of-measure-abbreviation-already-exists.error';
import {
  UnitOfMeasureOutput,
  toUnitOfMeasureOutput,
} from '../dtos/unit-of-measure-output';

export interface CreateUnitOfMeasureInput {
  name: string;
  abbreviation: string;
  description?: string;
  createdBy: string;
}

/** Same "frontend checks for an inactive match first, this rejects on skip" reasoning as `CreatePresentationTypeUseCase` — see that use case's own doc comment. */
@Injectable()
export class CreateUnitOfMeasureUseCase {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
  ) {}

  async execute(input: CreateUnitOfMeasureInput): Promise<UnitOfMeasureOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');
    const abbreviation = input.abbreviation.trim().replace(/\s+/g, ' ');
    const description =
      input.description?.trim().replace(/\s+/g, ' ') || null;

    const existingByName = await this.unitOfMeasureRepository.findByName(
      name,
    );
    if (existingByName) {
      throw new UnitOfMeasureNameAlreadyExistsError(
        name,
        !existingByName.isActive,
      );
    }

    const existingByAbbreviation =
      await this.unitOfMeasureRepository.findByActiveAbbreviation(
        abbreviation,
      );
    if (existingByAbbreviation) {
      throw new UnitOfMeasureAbbreviationAlreadyExistsError(abbreviation);
    }

    const unitOfMeasure = await this.unitOfMeasureRepository.create({
      name,
      abbreviation,
      description,
      createdBy: input.createdBy,
    });

    return toUnitOfMeasureOutput(unitOfMeasure);
  }
}
