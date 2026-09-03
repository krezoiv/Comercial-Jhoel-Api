import { DomainError } from '../../../../shared/domain/domain-error';

/**
 * Deliberately one generic message for every failure reason it covers:
 * unknown username/phone, wrong password, and a deactivated account in
 * `LoginUseCase`; a wrong current password in `ChangePasswordUseCase`. A
 * caller must never be able to distinguish "this account doesn't exist"
 * from "this account exists but something else is wrong" by message or
 * timing — see each use case's own throw sites for the specific branches.
 */
export class InvalidCredentialsError extends DomainError {
  readonly status = 401;

  constructor() {
    super('Credenciales inválidas.');
  }
}
