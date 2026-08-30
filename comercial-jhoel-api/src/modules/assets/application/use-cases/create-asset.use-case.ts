import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import {
  ReferencedClientInactiveError,
  ReferencedClientNotFoundError,
} from '../../domain/errors/referenced-client-invalid.error';
import { AssetOutput, toAssetOutput } from '../dtos/asset-output';

export interface CreateAssetInput {
  clientId: string;
  date: string;
  amount: number;
  description?: string;
  createdBy: string;
}

@Injectable()
export class CreateAssetUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateAssetInput): Promise<AssetOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }
    if (!client.isActive) {
      throw new ReferencedClientInactiveError();
    }

    const description = input.description?.trim().replace(/\s+/g, ' ') || null;

    const asset = await this.assetRepository.create({
      clientId: input.clientId,
      date: input.date,
      amount: input.amount,
      description,
      createdBy: input.createdBy,
    });

    return toAssetOutput(asset);
  }
}
