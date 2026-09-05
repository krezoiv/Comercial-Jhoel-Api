import { Inject, Injectable } from '@nestjs/common';
import { PRESENTATION_TYPE_REPOSITORY } from '../../domain/repositories/presentation-type.repository';
import type { PresentationTypeRepository } from '../../domain/repositories/presentation-type.repository';
import { PresentationTypeNotFoundError } from '../../domain/errors/presentation-type-not-found.error';

/**
 * Soft delete only — never a physical `DELETE`. Deliberately does NOT block
 * on `usageCount > 0`: a presentation already used by historical products
 * can still be deactivated so it stops appearing for *new* products, per
 * the plan's own reasoning (que siga funcionando para los productos que ya
 * la usan, sin bloquear la desactivación).
 */
@Injectable()
export class DeactivatePresentationTypeUseCase {
  constructor(
    @Inject(PRESENTATION_TYPE_REPOSITORY)
    private readonly presentationTypeRepository: PresentationTypeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const presentationType = await this.presentationTypeRepository.findById(
      id,
    );
    if (!presentationType) {
      throw new PresentationTypeNotFoundError(id);
    }
    await this.presentationTypeRepository.deactivate(id);
  }
}
