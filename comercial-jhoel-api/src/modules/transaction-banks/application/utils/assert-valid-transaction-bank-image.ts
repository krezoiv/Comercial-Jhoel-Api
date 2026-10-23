import { InvalidTransactionBankImageError } from '../../domain/errors/invalid-transaction-bank-image.error';

/** Mismo techo y formatos que el resto de imágenes del proyecto (Catálogo de Bancos, Teléfonos, Noticias). */
export const MAX_TRANSACTION_BANK_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface UploadedTransactionBankImage {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export function assertValidTransactionBankImage(
  file: UploadedTransactionBankImage | undefined,
): asserts file is UploadedTransactionBankImage {
  if (!file || file.size === 0) {
    throw new InvalidTransactionBankImageError('La imagen está vacía.');
  }
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new InvalidTransactionBankImageError(
      'La imagen debe ser JPG, PNG o WEBP.',
    );
  }
  if (file.size > MAX_TRANSACTION_BANK_IMAGE_SIZE_BYTES) {
    throw new InvalidTransactionBankImageError(
      'La imagen no puede superar los 5 MB.',
    );
  }
}
