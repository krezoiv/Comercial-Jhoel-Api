import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Reused for both "doesn't exist" and "exists but isn't published" on every
 * PUBLIC read (detail, image, create-request) — a 404 here never reveals
 * whether an unpublished/inactive phone actually exists in the admin
 * catalog, same "don't leak existence" reasoning already used elsewhere in
 * this codebase for internal-only rows.
 */
export class CatalogPhoneNotPublishedError extends DomainError {
  readonly status = 404;

  constructor() {
    super('El teléfono solicitado no está disponible en el catálogo.');
  }
}
