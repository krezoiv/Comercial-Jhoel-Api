import { InvalidDpiImageError } from '../../domain/errors/invalid-dpi-image.error';

/** Mirrors `MAX_IMPORT_FILE_SIZE_BYTES` on `ProductsController` (this codebase's only other file-upload limit) — no reason for a photo to need a different ceiling. */
export const MAX_DPI_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedDpiImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

/** Validated before ever opening the registration's transaction — a doomed upload should never take a DB transaction slot. Never trusts the frontend's own `accept="image/*"` hint alone. */
export function assertValidDpiImage(file: UploadedDpiImage): void {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidDpiImageError(
      'La imagen del DPI debe ser JPG, PNG o WEBP.',
    );
  }
  if (file.size > MAX_DPI_IMAGE_SIZE_BYTES) {
    throw new InvalidDpiImageError('La imagen del DPI no puede superar los 5 MB.');
  }
  if (file.size === 0) {
    throw new InvalidDpiImageError('La imagen del DPI está vacía.');
  }
}
