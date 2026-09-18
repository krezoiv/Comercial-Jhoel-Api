import { isUUID } from 'class-validator';
import { InvalidVisitorIdError } from '../../domain/errors/invalid-visitor-id.error';

/** Like/unlike: el header es obligatorio y debe ser un UUID válido — 400 si falta o está mal formado. */
export function parseRequiredVisitorId(header: string | undefined): string {
  if (!header || !isUUID(header)) {
    throw new InvalidVisitorIdError();
  }
  return header;
}

/** Listados/detalle: el header es opcional — un header ausente o mal formado se trata como "primera visita" (nunca rompe la lectura), nunca lanza. */
export function parseOptionalVisitorId(header: string | undefined): string | undefined {
  return header && isUUID(header) ? header : undefined;
}
