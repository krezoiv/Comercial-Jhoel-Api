import { Supplier } from '../../domain/entities/supplier.entity';

/** Plain, serializable shape use cases return — never the domain entity itself. */
export interface SupplierOutput {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  taxId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toSupplierOutput(supplier: Supplier): SupplierOutput {
  return {
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    email: supplier.email,
    address: supplier.address,
    taxId: supplier.taxId,
    isActive: supplier.isActive,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}
