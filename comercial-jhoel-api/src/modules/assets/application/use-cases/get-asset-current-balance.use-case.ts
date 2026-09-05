import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { ReferencedClientNotFoundError } from '../../domain/errors/referenced-client-invalid.error';

/** Backs the client selector's "Saldo actual" display — a single bounded aggregate, never a full-history fetch. */
@Injectable()
export class GetAssetCurrentBalanceUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(clientId: string): Promise<{ balance: number }> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }

    const balance = await this.assetRepository.getCurrentBalance(clientId);
    return { balance };
  }
}
