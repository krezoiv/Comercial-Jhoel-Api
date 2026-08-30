import { Client } from '../entities/client.entity';

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface CreateClientData {
  name: string;
  createdBy: string;
}

export interface UpdateClientData {
  name?: string;
  updatedBy: string;
}

export interface FindClientsOptions {
  activeOnly: boolean;
}

export interface ClientRepository {
  findAll(options: FindClientsOptions): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  /** Case-insensitive lookup among active clients only — mirrors the `LOWER(name)` partial unique index. */
  findByActiveName(name: string): Promise<Client | null>;
  create(data: CreateClientData): Promise<Client>;
  update(id: string, data: UpdateClientData): Promise<Client>;
  deactivate(id: string): Promise<void>;
}
