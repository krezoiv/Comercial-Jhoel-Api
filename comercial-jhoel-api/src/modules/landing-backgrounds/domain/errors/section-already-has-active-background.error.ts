import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Thrown by `CreateLandingBackgroundUseCase` when the target section
 * already has an active background — the real guarantee is the partial
 * unique index `UQ_landing_backgrounds_section_active` (this is the
 * friendly pre-check, not the enforcement). The frontend is expected to
 * already know this before ever calling create (its own already-loaded
 * list tells it which sections are taken), same "ya existe, ¿desea
 * activarla?" pattern already established for presentation-types/units-
 * of-measure — this error is the safety net for a stale list or a direct
 * API call, not the primary UX path.
 */
export class SectionAlreadyHasActiveBackgroundError extends DomainError {
  readonly status = 409;

  constructor(sectionKey: string) {
    super(`La sección "${sectionKey}" ya tiene un fondo activo. Desactívalo o edítalo en vez de crear uno nuevo.`);
  }
}
