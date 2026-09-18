import { CatalogBank } from '../entities/catalog-bank.entity';

export const CATALOG_BANK_REPOSITORY = Symbol('CATALOG_BANK_REPOSITORY');

export interface CreateCatalogBankData {
  name: string;
  description: string | null;
  additionalInfo: string | null;
  createdBy: string;
}

export interface UpdateCatalogBankData {
  name?: string;
  description?: string | null;
  additionalInfo?: string | null;
  updatedBy: string;
}

export interface ListCatalogBanksOptions {
  includeInactive?: boolean;
  search?: string;
}

export interface ReorderCatalogBankItem {
  id: string;
  sortOrder: number;
}

export interface CatalogBankImageBytes {
  data: Buffer;
  mimeType: string;
}

export interface CatalogBankRepository {
  findAll(options?: ListCatalogBanksOptions): Promise<CatalogBank[]>;
  findById(id: string): Promise<CatalogBank | null>;
  /** Público — solo `isActive`, ordenado por `sortOrder`. */
  findPublished(): Promise<CatalogBank[]>;
  create(data: CreateCatalogBankData): Promise<CatalogBank>;
  update(id: string, data: UpdateCatalogBankData): Promise<CatalogBank>;
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  reorder(items: ReorderCatalogBankItem[]): Promise<void>;
  setImage(id: string, image: { data: Buffer; mimeType: string; sizeBytes: number }, updatedBy: string): Promise<void>;
  removeImage(id: string, updatedBy: string): Promise<void>;
  getImage(id: string): Promise<CatalogBankImageBytes | null>;
}
