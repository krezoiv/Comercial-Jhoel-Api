import { Inject, Injectable } from '@nestjs/common';
import { RECHARGE_SALE_REPOSITORY } from '../../domain/repositories/recharge-sale.repository';
import type { RechargeSaleRepository } from '../../domain/repositories/recharge-sale.repository';

/** Rejects (`RechargeSaleLockedError`) if the sale's cycle has already been closed — enforced atomically inside `delete_recharge_sale()`. */
@Injectable()
export class DeleteRechargeSaleUseCase {
  constructor(
    @Inject(RECHARGE_SALE_REPOSITORY)
    private readonly saleRepository: RechargeSaleRepository,
  ) {}

  execute(id: string): Promise<void> {
    return this.saleRepository.delete(id);
  }
}
