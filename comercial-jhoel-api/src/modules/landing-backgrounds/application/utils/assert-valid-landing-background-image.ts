import { InvalidLandingBackgroundImageError } from '../../domain/errors/invalid-landing-background-image.error';

/** Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, Noticias, Catálogo de Bancos). */
export const MAX_LANDING_BACKGROUND_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedLandingBackgroundImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export function assertValidLandingBackgroundImage(file: UploadedLandingBackgroundImage): void {
  if (!file || file.size === 0) {
    throw new InvalidLandingBackgroundImageError('La imagen está vacía.');
  }
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidLandingBackgroundImageError('La imagen debe ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_LANDING_BACKGROUND_IMAGE_SIZE_BYTES) {
    throw new InvalidLandingBackgroundImageError('La imagen no puede superar los 5 MB.');
  }
}
