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

export interface RegisterAssetChargeInput {
  clientId: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
}

/** "Registrar Cargo" for Activos — an independent Kardex movement, never a rewrite of a prior one (see the migration's own doc comment for the full reasoning). */
@Injectable()
export class RegisterAssetChargeUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: RegisterAssetChargeInput): Promise<AssetOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }
    if (!client.isActive) {
      throw new ReferencedClientInactiveError();
    }

    const description = input.description?.trim().replace(/\s+/g, ' ') || null;

    const movement = await this.assetRepository.registerMovement({
      clientId: input.clientId,
      movementType: 'CARGO',
      amount: input.amount,
      date: input.date,
      description,
      createdBy: input.createdBy,
    });

    return toAssetOutput(movement);
  }
}
