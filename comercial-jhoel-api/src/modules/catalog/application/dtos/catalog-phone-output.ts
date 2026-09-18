import {
  CatalogPhone,
  CatalogPhoneExtraSpec,
} from '../../domain/entities/catalog-phone.entity';
import { isKrediyaCreditAvailable } from '../utils/is-krediya-credit-available';

export interface CatalogPhoneImageOutput {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
}

/** Admin shape — every field, including internal flags (`isActive`/`isPublished`/`sortOrder`/audit columns) a `PhoneCatalogo` management screen needs. Never sent to an unauthenticated caller. */
export interface CatalogPhoneOutput {
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
  /** Computed via `isKrediyaCreditAvailable` — shown in the admin table for reference, but the frontend must never treat this as authoritative for anything other than display (the public endpoint recomputes it independently, and request creation always recomputes it server-side again). */
  creditAvailable: boolean;
  images: CatalogPhoneImageOutput[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

/**
 * Public shape — deliberately narrow, backs the landing page's catalog.
 * Excludes `isActive`/`isPublished`/`sortOrder`/`createdBy*`/`updatedBy*`
 * (internal/administrative) — a `CatalogPhone` never reaches
 * `findPublished()` unless it's already `isActive && isPublished`, so those
 * flags would be redundant noise on the public shape, not new information.
 */
export interface PublicCatalogPhoneOutput {
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
  likesCount: number;
  images: CatalogPhoneImageOutput[];
}

function toImageOutputs(phone: CatalogPhone): CatalogPhoneImageOutput[] {
  return [...phone.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => ({
      id: image.id,
      isPrimary: image.isPrimary,
      sortOrder: image.sortOrder,
    }));
}

export function toCatalogPhoneOutput(
  phone: CatalogPhone,
  krediyaMinAmount: number | null,
): CatalogPhoneOutput {
  return {
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    description: phone.description,
    price: phone.price,
    screen: phone.screen,
    ram: phone.ram,
    storage: phone.storage,
    camera: phone.camera,
    battery: phone.battery,
    processor: phone.processor,
    operatingSystem: phone.operatingSystem,
    extraSpecs: phone.extraSpecs,
    isActive: phone.isActive,
    isPublished: phone.isPublished,
    sortOrder: phone.sortOrder,
    likesCount: phone.likesCount,
    creditAvailable: isKrediyaCreditAvailable(phone.price, krediyaMinAmount),
    images: toImageOutputs(phone),
    createdAt: phone.createdAt,
    updatedAt: phone.updatedAt,
    createdBy: phone.createdBy,
    createdByUsername: phone.createdByUsername,
    updatedBy: phone.updatedBy,
    updatedByUsername: phone.updatedByUsername,
  };
}

export function toPublicCatalogPhoneOutput(
  phone: CatalogPhone,
  krediyaMinAmount: number | null,
): PublicCatalogPhoneOutput {
  return {
    id: phone.id,
    brand: phone.brand,
    model: phone.model,
    description: phone.description,
    price: phone.price,
    screen: phone.screen,
    ram: phone.ram,
    storage: phone.storage,
    camera: phone.camera,
    battery: phone.battery,
    processor: phone.processor,
    operatingSystem: phone.operatingSystem,
    extraSpecs: phone.extraSpecs,
    creditAvailable: isKrediyaCreditAvailable(phone.price, krediyaMinAmount),
    likesCount: phone.likesCount,
    images: toImageOutputs(phone),
  };
}
