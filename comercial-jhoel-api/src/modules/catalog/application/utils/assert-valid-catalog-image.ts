import { InvalidCatalogImageError } from '../../domain/errors/invalid-catalog-image.error';

/** Same ceiling as `phones`' own `MAX_DPI_IMAGE_SIZE_BYTES` — no reason for a catalog photo to need a different one. */
export const MAX_CATALOG_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedCatalogImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/** Validated before ever touching the database — never trusts the frontend's own `accept="image/*"` hint alone. */
export function assertValidCatalogImage(file: UploadedCatalogImage): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidCatalogImageError('La imagen debe ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_CATALOG_IMAGE_SIZE_BYTES) {
    throw new InvalidCatalogImageError('La imagen no puede superar los 5 MB.');
  }
  if (file.size === 0) {
    throw new InvalidCatalogImageError('La imagen está vacía.');
  }
}
