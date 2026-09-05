import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../domain/repositories/unit-of-measure.repository';
import { UnitOfMeasureNotFoundError } from '../../domain/errors/unit-of-measure-not-found.error';
import {
  UnitOfMeasureOutput,
  toUnitOfMeasureOutput,
} from '../dtos/unit-of-measure-output';

@Injectable()
export class GetUnitOfMeasureByIdUseCase {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
  ) {}

  async execute(id: string): Promise<UnitOfMeasureOutput> {
    const unitOfMeasure = await this.unitOfMeasureRepository.findById(id);
    if (!unitOfMeasure) {
      throw new UnitOfMeasureNotFoundError(id);
    }
    return toUnitOfMeasureOutput(unitOfMeasure);
  }
}
