import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { AssetNotFoundError } from '../../domain/errors/asset-not-found.error';
import {
  ReferencedClientInactiveError,
  ReferencedClientNotFoundError,
} from '../../domain/errors/referenced-client-invalid.error';
import { AssetOutput, toAssetOutput } from '../dtos/asset-output';

export interface UpdateAssetInput {
  clientId?: string;
  date?: string;
  amount?: number;
  description?: string | null;
  updatedBy: string;
}

@Injectable()
export class UpdateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: string, input: UpdateAssetInput): Promise<AssetOutput> {
    const asset = await this.assetRepository.findById(id);
    if (!asset) {
      throw new AssetNotFoundError();
    }

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client) {
        throw new ReferencedClientNotFoundError();
      }
      if (!client.isActive) {
        throw new ReferencedClientInactiveError();
      }
    }

    const description =
      input.description !== undefined
        ? input.description?.trim().replace(/\s+/g, ' ') || null
        : undefined;

    const updated = await this.assetRepository.update(id, {
      ...(input.clientId ? { clientId: input.clientId } : {}),
      ...(input.date ? { date: input.date } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(description !== undefined ? { description } : {}),
      updatedBy: input.updatedBy,
    });

    return toAssetOutput(updated);
  }
}
