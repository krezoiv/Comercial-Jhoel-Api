/**
 * Base class for every business-rule violation across all modules.
 * `GlobalExceptionFilter` reads `status` directly off any thrown instance —
 * a new domain error only has to set this field to control its HTTP
 * response; no filter or controller wiring is needed per error type.
 */
export abstract class DomainError extends Error {
  abstract readonly status: number;

  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
