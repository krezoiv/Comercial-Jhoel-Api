import { Inject, Injectable } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessNotFoundError } from '../../domain/errors/business-not-found.error';
import { BusinessNameAlreadyExistsError } from '../../domain/errors/business-name-already-exists.error';
import { BusinessOutput, toBusinessOutput } from '../dtos/business-output';

export interface UpdateBusinessInput {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateBusinessInput,
  ): Promise<BusinessOutput> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new BusinessNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name !== business.name) {
      const existing = await this.businessRepository.findByName(name);
      if (existing) {
        throw new BusinessNameAlreadyExistsError(name);
      }
    }

    const updated = await this.businessRepository.update(id, {
      ...(name ? { name } : {}),
      ...(input.description !== undefined
        ? { description: input.description?.trim() || null }
        : {}),
    });
    return toBusinessOutput(updated);
  }
}
