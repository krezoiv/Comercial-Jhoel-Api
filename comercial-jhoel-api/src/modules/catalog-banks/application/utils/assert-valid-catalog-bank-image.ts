import { InvalidCatalogBankImageError } from '../../domain/errors/invalid-catalog-bank-image.error';

/** Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, Noticias, DPI). */
export const MAX_CATALOG_BANK_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedCatalogBankImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export function assertValidCatalogBankImage(file: UploadedCatalogBankImage): void {
  if (!file || file.size === 0) {
    throw new InvalidCatalogBankImageError('La imagen está vacía.');
  }
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidCatalogBankImageError('La imagen debe ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_CATALOG_BANK_IMAGE_SIZE_BYTES) {
    throw new InvalidCatalogBankImageError('La imagen no puede superar los 5 MB.');
  }
}
