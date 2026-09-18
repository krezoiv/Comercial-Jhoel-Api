import {
  CatalogPhone,
  CatalogPhoneExtraSpec,
} from '../entities/catalog-phone.entity';
import { CatalogPhoneImage } from '../entities/catalog-phone-image.entity';

export const CATALOG_PHONE_REPOSITORY = Symbol('CATALOG_PHONE_REPOSITORY');

export interface CreateCatalogPhoneData {
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
  createdBy: string;
}

export interface UpdateCatalogPhoneData {
  brand?: string;
  model?: string;
  description?: string | null;
  price?: number;
  screen?: string | null;
  ram?: string | null;
  storage?: string | null;
  camera?: string | null;
  battery?: string | null;
  processor?: string | null;
  operatingSystem?: string | null;
  extraSpecs?: CatalogPhoneExtraSpec[];
  updatedBy: string;
}

export interface ListCatalogPhonesOptions {
  includeInactive?: boolean;
  search?: string;
}

export interface ReorderCatalogPhoneItem {
  id: string;
  sortOrder: number;
}

export interface AddCatalogPhoneImageData {
  catalogPhoneId: string;
  imageData: Buffer;
  mimeType: string;
  sizeBytes: number;
  isPrimary: boolean;
  sortOrder: number;
  createdBy: string;
}

export interface CatalogPhoneImageBytes {
  data: Buffer;
  mimeType: string;
  catalogPhoneId: string;
}

export interface CatalogPhoneRepository {
  /** Admin listing — includes unpublished/inactive rows, filtered client-side plus optional `search`/`includeInactive`, same pattern as Categorías/Clientes. */
  findAll(options?: ListCatalogPhonesOptions): Promise<CatalogPhone[]>;
  findById(id: string): Promise<CatalogPhone | null>;
  /** Public catalog — only `isPublished && isActive`, ordered by `sortOrder`. */
  findPublished(): Promise<CatalogPhone[]>;
  create(data: CreateCatalogPhoneData): Promise<CatalogPhone>;
  update(id: string, data: UpdateCatalogPhoneData): Promise<CatalogPhone>;
  /** Deactivating force-unpublishes too — see `DeactivateCatalogPhoneUseCase`. */
  setActive(id: string, isActive: boolean, updatedBy: string): Promise<void>;
  setPublished(
    id: string,
    isPublished: boolean,
    updatedBy: string,
  ): Promise<void>;
  reorder(items: ReorderCatalogPhoneItem[]): Promise<void>;
  /** Incremento atómico (`delta` +1/-1) — nunca lee-modifica-escribe desde la aplicación, así dos likes concurrentes nunca se pisan. Nunca baja de 0. Devuelve el conteo resultante. */
  adjustLikes(id: string, delta: number): Promise<number>;
  listImages(catalogPhoneId: string): Promise<CatalogPhoneImage[]>;
  addImage(data: AddCatalogPhoneImageData): Promise<CatalogPhoneImage>;
  removeImage(catalogPhoneId: string, imageId: string): Promise<void>;
  /** Atomically clears any other primary flag on this phone's images before setting this one — enforced by `UQ_catalog_phone_images_primary`. */
  setPrimaryImage(catalogPhoneId: string, imageId: string): Promise<void>;
  /** Raw bytes for the one streaming endpoint — never loaded as part of `CatalogPhone.images`. */
  getImage(imageId: string): Promise<CatalogPhoneImageBytes | null>;
}
