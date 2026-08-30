import { Inject, Injectable } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessOutput, toBusinessOutput } from '../dtos/business-output';

export interface ListBusinessesInput {
  activeOnly?: boolean;
}

@Injectable()
export class ListBusinessesUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(input: ListBusinessesInput = {}): Promise<BusinessOutput[]> {
    const businesses = await this.businessRepository.findAll({
      activeOnly: input.activeOnly ?? false,
    });
    return businesses.map(toBusinessOutput);
  }
}
