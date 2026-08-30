import { Inject, Injectable } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessNotFoundError } from '../../domain/errors/business-not-found.error';
import { BusinessOutput, toBusinessOutput } from '../dtos/business-output';

@Injectable()
export class GetBusinessByIdUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(id: string): Promise<BusinessOutput> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new BusinessNotFoundError(id);
    }
    return toBusinessOutput(business);
  }
}
