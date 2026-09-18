/** Ficha completa de administración — catálogo público informativo, independiente del módulo financiero de Bancos (Agentes Bancarios/Cuadre). */
export interface CatalogBank {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  isActive: boolean;
  sortOrder: number;
  hasImage: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export interface CreateCatalogBankInput {
  name: string;
  description?: string;
  additionalInfo?: string;
}

export interface UpdateCatalogBankInput {
  name?: string;
  description?: string;
  additionalInfo?: string;
}

/** Shape público — backs "Bancos" en la landing. Sin isActive/audit/orden. */
export interface PublicCatalogBank {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  hasImage: boolean;
}
