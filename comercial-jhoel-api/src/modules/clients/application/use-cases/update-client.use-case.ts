import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import type { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error';
import { ClientNameAlreadyExistsError } from '../../domain/errors/client-name-already-exists.error';
import { ClientOutput, toClientOutput } from '../dtos/client-output';

export interface UpdateClientInput {
  name?: string;
  updatedBy: string;
}

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: string, input: UpdateClientInput): Promise<ClientOutput> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }

    const name = input.name?.trim().replace(/\s+/g, ' ');
    if (name && name.toLowerCase() !== client.name.toLowerCase()) {
      const existing = await this.clientRepository.findByActiveName(name);
      if (existing) {
        throw new ClientNameAlreadyExistsError(name);
      }
    }

    const updated = await this.clientRepository.update(id, {
      ...(name ? { name } : {}),
      updatedBy: input.updatedBy,
    });

    return toClientOutput(updated);
  }
}
