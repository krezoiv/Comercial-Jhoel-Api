import { DomainError } from '../../../../shared/domain/domain-error';

export class RoleHasAssignedUsersError extends DomainError {
  readonly status = 409;

  constructor() {
    super(
      'No se puede desactivar este rol porque tiene usuarios activos asignados.',
    );
  }
}
