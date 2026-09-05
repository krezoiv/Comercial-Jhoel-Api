import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_MEASURE_REPOSITORY } from '../../domain/repositories/unit-of-measure.repository';
import type { UnitOfMeasureRepository } from '../../domain/repositories/unit-of-measure.repository';
import {
  UnitOfMeasureListOutput,
  toUnitOfMeasureListOutput,
} from '../dtos/unit-of-measure-output';

export interface ListUnitsOfMeasureInput {
  includeInactive?: boolean;
  search?: string;
}

@Injectable()
export class ListUnitsOfMeasureUseCase {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY)
    private readonly unitOfMeasureRepository: UnitOfMeasureRepository,
  ) {}

  async execute(
    input: ListUnitsOfMeasureInput = {},
  ): Promise<UnitOfMeasureListOutput[]> {
    const items = await this.unitOfMeasureRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
    });
    return items.map(toUnitOfMeasureListOutput);
  }
}
