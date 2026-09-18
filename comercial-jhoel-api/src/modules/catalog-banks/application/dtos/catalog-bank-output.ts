import { CatalogBank } from '../../domain/entities/catalog-bank.entity';

export interface CatalogBankOutput {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  isActive: boolean;
  sortOrder: number;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** Shape público — backs "Bancos" en la landing. Sin isActive/audit. Nunca incluye ningún dato del módulo financiero "Bancos" (saldos, cuentas, movimientos) — este catálogo no lo conoce en absoluto. */
export interface PublicCatalogBankOutput {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  hasImage: boolean;
}

export function toCatalogBankOutput(bank: CatalogBank): CatalogBankOutput {
  return {
    id: bank.id,
    name: bank.name,
    description: bank.description,
    additionalInfo: bank.additionalInfo,
    isActive: bank.isActive,
    sortOrder: bank.sortOrder,
    hasImage: bank.hasImage,
    createdAt: bank.createdAt,
    updatedAt: bank.updatedAt,
    createdBy: bank.createdBy,
    createdByUsername: bank.createdByUsername,
    updatedBy: bank.updatedBy,
    updatedByUsername: bank.updatedByUsername,
  };
}

export function toPublicCatalogBankOutput(bank: CatalogBank): PublicCatalogBankOutput {
  return {
    id: bank.id,
    name: bank.name,
    description: bank.description,
    additionalInfo: bank.additionalInfo,
    hasImage: bank.hasImage,
  };
}
