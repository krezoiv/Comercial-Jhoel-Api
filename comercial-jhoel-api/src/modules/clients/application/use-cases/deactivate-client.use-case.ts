import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import type { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error';

/** Soft delete only — DELETE /clients/:id never removes the row, preserving future Ventas/historial integrity. */
@Injectable()
export class DeactivateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    await this.clientRepository.deactivate(id);
  }
}
