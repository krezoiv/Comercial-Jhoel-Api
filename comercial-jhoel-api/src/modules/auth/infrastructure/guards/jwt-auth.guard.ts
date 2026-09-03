import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * `@UseGuards(JwtAuthGuard)` on a route runs Passport's `'jwt'` strategy —
 * i.e. `JwtStrategy.validate()` — before the handler executes, rejecting
 * with 401 on a missing/invalid/expired token and otherwise populating
 * `request.user` (read via the `@CurrentUser` decorator). This class has
 * no logic of its own; it only names which registered strategy to run.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
