import { InvalidDpiImageError } from '../../domain/errors/invalid-dpi-image.error';

/** Same ceiling as `recharges`' own `MAX_DPI_IMAGE_SIZE_BYTES` (itself mirroring `ProductsController`'s import-file limit) — no reason for a phone-sale DPI photo to need a different one. */
export const MAX_DPI_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedDpiImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/** Validated before the sale is ever attempted — a doomed upload should never reach the database. Never trusts the frontend's own `accept="image/*"` hint alone. */
export function assertValidDpiImage(file: UploadedDpiImage): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidDpiImageError(
      'La imagen del DPI debe ser JPG, PNG o WEBP.',
    );
  }
  if (file.size > MAX_DPI_IMAGE_SIZE_BYTES) {
    throw new InvalidDpiImageError(
      'La imagen del DPI no puede superar los 5 MB.',
    );
  }
  if (file.size === 0) {
    throw new InvalidDpiImageError('La imagen del DPI está vacía.');
  }
}
