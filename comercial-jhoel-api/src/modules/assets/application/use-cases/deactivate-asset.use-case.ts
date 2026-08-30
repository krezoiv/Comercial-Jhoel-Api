import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetNotFoundError } from '../../domain/errors/asset-not-found.error';

/** Soft delete only — DELETE /assets/:id never removes the row, preserving historial integrity. */
@Injectable()
export class DeactivateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new AssetNotFoundError();
    }
    await this.assetRepository.deactivate(id);
  }
}
