import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../../shared/decorators/roles.decorator';
import { RequestUser } from '../../../../shared/decorators/current-user.decorator';
import { RoleName } from '../../../roles/domain/entities/role.entity';

/**
 * Must run after JwtAuthGuard (`@UseGuards(JwtAuthGuard, RolesGuard)`) so
 * `request.user` is already populated. A route with no `@Roles(...)` passes
 * through untouched — this only restricts routes that opt in.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      RoleName[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const role = request.user?.role;

    if (!role || !requiredRoles.includes(role as RoleName)) {
      throw new ForbiddenException(
        'No tienes permisos para realizar esta acción.',
      );
    }

    return true;
  }
}
