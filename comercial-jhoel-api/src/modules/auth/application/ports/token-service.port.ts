export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');

/**
 * The claims actually encoded in the JWT. `role` here can go stale (it's
 * whatever was true at login time) — `JwtStrategy.validate()` deliberately
 * ignores this field and re-reads the user's *current* role from the
 * database on every request instead; only `sub` (the user id) is trusted
 * from the token itself.
 */
export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: string;
}

/** A port around `@nestjs/jwt`, mirroring `PasswordHasher`'s own reasoning — `LoginUseCase` depends on this interface, not on `JwtService` directly. */
export interface TokenService {
  sign(payload: AuthTokenPayload): string;
}
