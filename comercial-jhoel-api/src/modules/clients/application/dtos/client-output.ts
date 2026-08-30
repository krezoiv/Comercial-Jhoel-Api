import { Client } from '../../domain/entities/client.entity';

export interface ClientOutput {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export function toClientOutput(client: Client): ClientOutput {
  return {
    id: client.id,
    name: client.name,
    isActive: client.isActive,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
    createdBy: client.createdBy,
    createdByUsername: client.createdByUsername,
    updatedBy: client.updatedBy,
    updatedByUsername: client.updatedByUsername,
  };
}
