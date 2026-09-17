import { InvalidCatalogProductImageError } from '../../domain/errors/invalid-catalog-product-image.error';

/** Mismo techo que el resto de imágenes del proyecto (Teléfonos, DPI). */
export const MAX_CATALOG_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedCatalogProductImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export function assertValidCatalogProductImage(
  file: UploadedCatalogProductImage,
): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidCatalogProductImageError('La imagen debe ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_CATALOG_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new InvalidCatalogProductImageError('La imagen no puede superar los 5 MB.');
  }
  if (file.size === 0) {
    throw new InvalidCatalogProductImageError('La imagen está vacía.');
  }
}
