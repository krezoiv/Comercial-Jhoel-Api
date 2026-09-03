export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

/**
 * A port, not a direct `bcrypt` import — `auth` and `users` use cases
 * depend on this interface only, so the hashing library can be swapped
 * (or mocked in a test) by changing `SharedModule`'s provider, without
 * touching any use case that hashes or compares a password.
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
