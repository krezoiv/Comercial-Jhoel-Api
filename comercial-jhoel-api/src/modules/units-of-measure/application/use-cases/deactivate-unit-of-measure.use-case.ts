import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../domain/repositories/unit-of-measure.repository';
import { UnitOfMeasureNotFoundError } from '../../domain/errors/unit-of-measure-not-found.error';

/** Soft delete only — never a physical `DELETE`. Does not block on `usageCount > 0`, same reasoning as `DeactivatePresentationTypeUseCase`. */
@Injectable()
export class DeactivateUnitOfMeasureUseCase {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const unitOfMeasure = await this.unitOfMeasureRepository.findById(id);
    if (!unitOfMeasure) {
      throw new UnitOfMeasureNotFoundError(id);
    }
    await this.unitOfMeasureRepository.deactivate(id);
  }
}
