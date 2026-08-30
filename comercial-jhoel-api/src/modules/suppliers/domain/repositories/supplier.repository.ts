import { Supplier } from '../entities/supplier.entity';

export const SUPPLIER_REPOSITORY = Symbol('SUPPLIER_REPOSITORY');

export interface CreateSupplierData {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  taxId: string | null;
}

export interface UpdateSupplierData {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  taxId?: string | null;
}

export interface SupplierRepository {
  findAll(options?: { activeOnly?: boolean }): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  /** NIT/tax id is the natural dedup key here — unlike Categories/Businesses, supplier *names* are not required to be unique. */
  findActiveByTaxId(taxId: string): Promise<Supplier | null>;
  create(data: CreateSupplierData): Promise<Supplier>;
  update(id: string, data: UpdateSupplierData): Promise<Supplier>;
  deactivate(id: string): Promise<void>;
}
