import { CatalogPhoneExtraSpec } from '../../domain/entities/catalog-phone.entity';
import { CatalogPhoneImageResponseDto } from './catalog-phone.response.dto';

/**
 * Public shape — backs the landing page's "Teléfonos" catalog. No
 * `isActive`/`isPublished`/`sortOrder`/`createdBy*`/`updatedBy*` — a phone
 * never reaches this DTO unless it's already published+active (see
 * `ListPublishedCatalogPhonesUseCase`/`GetPublishedCatalogPhoneByIdUseCase`),
 * so those flags would add nothing. No `costPrice`/inventory/IMEI field
 * exists on this aggregate at all — there is nothing internal to
 * accidentally leak here.
 */
export class PublicCatalogPhoneResponseDto {
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
  liked: boolean;
  images: CatalogPhoneImageResponseDto[];
}
