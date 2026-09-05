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

export interface RegisterAssetPaymentInput {
  clientId: string;
  amount: number;
  date: string;
  description?: string;
  createdBy: string;
}

/**
 * "Registrar Abono" for Activos. Deliberately does NOT pre-check the amount
 * against the current balance — `register_asset_movement` allows the
 * resulting balance to go negative on purpose (Activos already has 5 real,
 * live rows depending on exactly this capability; see the migration's own
 * doc comment), unlike the equivalent Cuentas por Cobrar use case.
 */
@Injectable()
export class RegisterAssetPaymentUseCase {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: AssetRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: RegisterAssetPaymentInput): Promise<AssetOutput> {
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
      movementType: 'ABONO',
      amount: input.amount,
      date: input.date,
      description,
      createdBy: input.createdBy,
    });

    return toAssetOutput(movement);
  }
}
