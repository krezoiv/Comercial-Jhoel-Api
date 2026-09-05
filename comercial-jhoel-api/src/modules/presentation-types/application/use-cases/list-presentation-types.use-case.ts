import { Inject, Injectable } from '@nestjs/common';
import { PRESENTATION_TYPE_REPOSITORY } from '../../domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../domain/repositories/presentation-type.repository';
import {
  PresentationTypeListOutput,
  toPresentationTypeListOutput,
} from '../dtos/presentation-type-output';

export interface ListPresentationTypesInput {
  includeInactive?: boolean;
  search?: string;
}

@Injectable()
export class ListPresentationTypesUseCase {
  constructor(
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(
    input: ListPresentationTypesInput = {},
  ): Promise<PresentationTypeListOutput[]> {
    const items = await this.presentationTypeRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
    });
    return items.map(toPresentationTypeListOutput);
  }
}
