import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import type { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientOutput, toClientOutput } from '../dtos/client-output';

export interface ListClientsInput {
  includeInactive?: boolean;
  search?: string;
}

@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: ListClientsInput = {}): Promise<ClientOutput[]> {
    const clients = await this.clientRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
    });
    return clients.map(toClientOutput);
  }
}
