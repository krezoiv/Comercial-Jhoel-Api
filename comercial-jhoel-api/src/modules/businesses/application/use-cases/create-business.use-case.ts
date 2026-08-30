import { Inject, Injectable } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessNameAlreadyExistsError } from '../../domain/errors/business-name-already-exists.error';
import { BusinessOutput, toBusinessOutput } from '../dtos/business-output';

export interface CreateBusinessInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(input: CreateBusinessInput): Promise<BusinessOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing = await this.businessRepository.findByName(name);
    if (existing) {
      throw new BusinessNameAlreadyExistsError(name);
    }

    const business = await this.businessRepository.create({
      name,
      description: input.description?.trim() || null,
    });
    return toBusinessOutput(business);
  }
}
