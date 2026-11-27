import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetNotFoundError } from '../../domain/errors/asset-not-found.error';
import type { PortfolioRecordTrace } from '../../../../shared/domain/portfolio-record';

/**
 * How one record relates to the physical cash: its payment method, whether it
 * is tracked in the Kardex (records registered before Control de Efectivo are
 * not), the effect it must have, its Kardex movements (original, reversals,
 * re-applied effect) and its change history. The UI only shows it — the edit
 * and delete dialogs use it to say what will happen to Caja.
 */
@Injectable()
export class GetAssetTraceUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(id: string): Promise<PortfolioRecordTrace> {
    const trace = await this.assetRepository.getTrace(id);
    if (!trace) {
      throw new AssetNotFoundError();
    }
    return trace;
  }
}
