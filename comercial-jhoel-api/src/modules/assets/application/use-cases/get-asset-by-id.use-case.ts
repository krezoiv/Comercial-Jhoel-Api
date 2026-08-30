import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetNotFoundError } from '../../domain/errors/asset-not-found.error';
import { AssetOutput, toAssetOutput } from '../dtos/asset-output';

@Injectable()
export class GetAssetByIdUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
  ) {}

  async execute(id: string): Promise<AssetOutput> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new AssetNotFoundError();
    }
    return toAssetOutput(asset);
  }
}
