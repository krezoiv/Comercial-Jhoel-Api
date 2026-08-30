import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_REPOSITORY } from '../../domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../domain/repositories/ice-cream.repository';
import { IceCreamNotFoundError } from '../../domain/errors/ice-cream-not-found.error';

/** Soft delete only — DELETE /ice-creams/:id never removes the row. */
@Injectable()
export class DeactivateIceCreamUseCase {
  constructor(
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const iceCream = await this.iceCreamRepository.findById(id);
    if (!iceCream) {
      throw new IceCreamNotFoundError(id);
    }
    await this.iceCreamRepository.deactivate(id);
  }
}
