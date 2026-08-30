import { Inject, Injectable } from '@nestjs/common';
import { BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository';
import type { BusinessRepository } from '../../domain/repositories/business.repository';
import { BusinessNotFoundError } from '../../domain/errors/business-not-found.error';

/**
 * Soft delete only — a business is never physically removed. Deactivating it
 * doesn't touch products that reference it (referential integrity is never at
 * risk); it just drops out of `findAll({ activeOnly: true })` and blocks new
 * product assignments, the same pattern categories use.
 */
@Injectable()
export class DeactivateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: BusinessRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw new BusinessNotFoundError(id);
    }
    await this.businessRepository.deactivate(id);
  }
}
