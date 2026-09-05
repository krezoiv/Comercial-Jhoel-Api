import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

export interface AssetActiveBalanceOutput {
  totalAmount: number;
  recordCount: number;
}

/**
 * Backs the plain list screen's "Saldo total" tile — always scoped to
 * `isActive: true` only, independent of whatever search/date/client
 * filters the list itself currently has applied. Reuses the same
 * signed-sum `getReportSummary()` aggregate Cuadre de Agentes and
 * Reportería already depend on — never a client-side sum over one fetched
 * page, which would silently undercount whatever didn't fit the page.
 */
@Injectable()
export class GetAssetActiveBalanceUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(): Promise<AssetActiveBalanceOutput> {
    return this.assetRepository.getReportSummary({ isActive: true });
  }
}
