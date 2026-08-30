import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import type { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error';
import { ClientOutput, toClientOutput } from '../dtos/client-output';

@Injectable()
export class GetClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: string): Promise<ClientOutput> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return toClientOutput(client);
  }
}
