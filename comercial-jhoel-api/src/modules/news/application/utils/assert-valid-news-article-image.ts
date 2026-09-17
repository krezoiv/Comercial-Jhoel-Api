import { InvalidNewsArticleImageError } from '../../domain/errors/invalid-news-article-image.error';

/** Mismo techo que el resto de imágenes del proyecto (Teléfonos, Librería/Variedades, DPI). */
export const MAX_NEWS_ARTICLE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedNewsArticleImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export function assertValidNewsArticleImage(file: UploadedNewsArticleImage): void {
  if (!file || file.size === 0) {
    throw new InvalidNewsArticleImageError('La imagen está vacía.');
  }
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidNewsArticleImageError('La imagen debe ser JPG, PNG o WEBP.');
  }
  if (file.size > MAX_NEWS_ARTICLE_IMAGE_SIZE_BYTES) {
    throw new InvalidNewsArticleImageError('La imagen no puede superar los 5 MB.');
  }
}
