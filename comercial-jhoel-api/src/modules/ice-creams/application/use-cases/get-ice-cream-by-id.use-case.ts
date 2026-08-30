import { Inject, Injectable } from '@nestjs/common';
import { ICE_CREAM_REPOSITORY } from '../../domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../domain/repositories/ice-cream.repository';
import { IceCreamNotFoundError } from '../../domain/errors/ice-cream-not-found.error';
import { IceCreamOutput, toIceCreamOutput } from '../dtos/ice-cream-output';

@Injectable()
export class GetIceCreamByIdUseCase {
  constructor(
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
  ) {}

  async execute(id: string): Promise<IceCreamOutput> {
    const iceCream = await this.iceCreamRepository.findById(id);
    if (!iceCream) {
      throw new IceCreamNotFoundError(id);
    }
    return toIceCreamOutput(iceCream);
  }
}
