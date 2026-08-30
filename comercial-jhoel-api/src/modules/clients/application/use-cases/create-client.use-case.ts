import { Inject, Injectable } from '@nestjs/common';
import { CLIENT_REPOSITORY } from '../../domain/repositories/client.repository';
import type { ClientRepository } from '../../domain/repositories/client.repository';
import { ClientNameAlreadyExistsError } from '../../domain/errors/client-name-already-exists.error';
import { ClientOutput, toClientOutput } from '../dtos/client-output';

export interface CreateClientInput {
  name: string;
  createdBy: string;
}

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateClientInput): Promise<ClientOutput> {
    const name = input.name.trim().replace(/\s+/g, ' ');

    const existing = await this.clientRepository.findByActiveName(name);
    if (existing) {
      throw new ClientNameAlreadyExistsError(name);
    }

    const client = await this.clientRepository.create({
      name,
      createdBy: input.createdBy,
    });
    return toClientOutput(client);
  }
}
