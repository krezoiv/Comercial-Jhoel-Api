/** Una fila "otra especificación" configurable desde el panel. */
export interface CatalogPhoneExtraSpec {
  label: string;
  value: string;
}

export interface CatalogPhoneImage {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** Ficha completa de administración — incluye flags internos (`isActive`/`isPublished`/`sortOrder`) que el catálogo público nunca expone. */
export interface CatalogPhone {
  id: string;
  brand: string;
  model: string;
  description: string | null;
  price: number;
  screen: string | null;
  ram: string | null;
  storage: string | null;
  camera: string | null;
  battery: string | null;
  processor: string | null;
  operatingSystem: string | null;
  extraSpecs: CatalogPhoneExtraSpec[];
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  /** Calculado por el backend (`isKrediyaCreditAvailable`) — solo para referencia visual en el panel, nunca la fuente de verdad. */
  creditAvailable: boolean;
  images: CatalogPhoneImage[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/** Campos editables — sin id/timestamps/imágenes/flags de publicación (cada uno tiene su propia acción dedicada). */
export interface CatalogPhoneInput {
  brand: string;
  model: string;
  description: string | null;
  price: number;
  screen: string | null;
  ram: string | null;
  storage: string | null;
  camera: string | null;
  battery: string | null;
  processor: string | null;
  operatingSystem: string | null;
  extraSpecs: CatalogPhoneExtraSpec[];
}

/** Shape público — backs el carousel de la landing. Sin flags administrativos. */
export interface PublicCatalogPhone {
  id: string;
  brand: string;
  model: string;
  description: string | null;
  price: number;
  screen: string | null;
  ram: string | null;
  storage: string | null;
  camera: string | null;
  battery: string | null;
  processor: string | null;
  operatingSystem: string | null;
  extraSpecs: CatalogPhoneExtraSpec[];
  creditAvailable: boolean;
  images: CatalogPhoneImage[];
}
