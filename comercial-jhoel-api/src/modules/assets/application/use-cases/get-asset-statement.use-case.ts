import { Inject, Injectable } from '@nestjs/common';
import { ASSET_REPOSITORY } from '../../domain/repositories/asset.repository';
import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { ReferencedClientNotFoundError } from '../../domain/errors/referenced-client-invalid.error';
import {
  AssetStatementOutput,
  toAssetStatementOutput,
} from '../dtos/asset-statement-output';

export interface GetAssetStatementInput {
  clientId: string;
  dateFrom?: string;
  dateTo?: string;
}

/** Backs the "Estado de Cuenta" view — saldo inicial del periodo, movimientos con saldo corrido, totales. Never iterates full history client-side; the repository derives everything with one bounded, window-function query. */
@Injectable()
export class GetAssetStatementUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: GetAssetStatementInput): Promise<AssetStatementOutput> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ReferencedClientNotFoundError();
    }

    const statement = await this.assetRepository.getStatement(
      input.clientId,
      { dateFrom: input.dateFrom, dateTo: input.dateTo },
    );

    return toAssetStatementOutput(statement);
  }
}
