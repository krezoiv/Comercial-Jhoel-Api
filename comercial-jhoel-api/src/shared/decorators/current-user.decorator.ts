import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The shape `JwtStrategy.validate()` returns and Passport attaches to
 * `request.user` on every authenticated request — re-fetched from the
 * database each time, not decoded straight from the JWT payload, so a role
 * change or deactivation takes effect immediately (see `JwtStrategy`).
 */
export interface RequestUser {
  userId: string;
  username: string;
  role: string;
}

/**
 * `@CurrentUser('userId')` in a controller method reads straight from this
 * already-authenticated `request.user` — never from a client-supplied route
 * parameter or body field. This is the actual mechanism behind every
 * "operate only on my own data" / "can't spoof another user's id" guarantee
 * documented across the business modules.
 */
export const CurrentUser = createParamDecorator(
  (field: keyof RequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return field ? request.user[field] : request.user;
  },
);
