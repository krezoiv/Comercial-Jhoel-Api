import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetNotFoundError } from '../../domain/errors/asset-not-found.error';
import {
  portfolioRecordError,
  requireChangeReason,
} from '../../../../shared/domain/portfolio-record';

export interface DeactivateAssetInput {
  /** Mandatory (≥5): goes to the record history and to the Caja reversal. */
  reason: string;
  userId: string;
}

/**
 * Soft void only — DELETE /assets/:id never removes the row.
 * When the record moved Caja, the database reverses that movement (linked to
 * the original, with this reason and user) in the same transaction; a record
 * paid by bank or registered before Control de Efectivo leaves Caja alone.
 * A second void is rejected (`PORTFOLIO_RECORD_ALREADY_VOIDED`), never
 * reversed twice.
 */
@Injectable()
export class DeactivateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(id: string, input: DeactivateAssetInput): Promise<void> {
    const reason = requireChangeReason(input.reason);
    const record = await this.assetRepository.findById(id);
    if (!record) {
      throw new AssetNotFoundError();
    }
    if (!record.isActive) {
      throw portfolioRecordError('PORTFOLIO_RECORD_ALREADY_VOIDED');
    }
    await this.assetRepository.deactivate(id, reason, input.userId);
  }
}
