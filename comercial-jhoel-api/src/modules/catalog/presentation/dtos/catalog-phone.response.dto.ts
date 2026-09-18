import { CatalogPhoneExtraSpec } from '../../domain/entities/catalog-phone.entity';

export class CatalogPhoneImageResponseDto {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** Admin shape — full internal fields, never returned by a public/unauthenticated route. */
export class CatalogPhoneResponseDto {
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
  likesCount: number;
  creditAvailable: boolean;
  images: CatalogPhoneImageResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
