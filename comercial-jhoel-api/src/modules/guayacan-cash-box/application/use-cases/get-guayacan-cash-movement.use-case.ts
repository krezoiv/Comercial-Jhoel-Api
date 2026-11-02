import { Inject, Injectable } from '@nestjs/common';
import { GUAYACAN_CASH_BOX_REPOSITORY } from '../../domain/repositories/guayacan-cash-box.repository';
import type {
  GuayacanCashBoxRepository,
  GuayacanCashMovementDetail,
} from '../../domain/repositories/guayacan-cash-box.repository';
import { GuayacanMovementNotFoundError } from '../../domain/errors/guayacan-cash-box.errors';

@Injectable()
export class GetGuayacanCashMovementUseCase {
  constructor(
    @Inject(GUAYACAN_CASH_BOX_REPOSITORY)
    private readonly repository: GuayacanCashBoxRepository,
  ) {}

  async execute(id: string): Promise<GuayacanCashMovementDetail> {
    const movement = await this.repository.findMovementById(id);
    if (!movement) {
      throw new GuayacanMovementNotFoundError(id);
    }
    return movement;
  }
}
