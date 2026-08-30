import { Business } from '../entities/business.entity';

export const BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');

export interface CreateBusinessData {
  name: string;
  description: string | null;
}

export interface UpdateBusinessData {
  name?: string;
  description?: string | null;
}

export interface BusinessRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<Business[]>;
  findById(id: string): Promise<Business | null>;
  findByName(name: string): Promise<Business | null>;
  create(data: CreateBusinessData): Promise<Business>;
  update(id: string, data: UpdateBusinessData): Promise<Business>;
  deactivate(id: string): Promise<void>;
}
