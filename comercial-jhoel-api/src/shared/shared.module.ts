import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';

/**
 * The one piece of infrastructure genuinely shared across module
 * boundaries today: `auth` (login, change-password) and `users`
 * (self-registration, admin-created accounts) both need to hash/compare
 * passwords, so both import this module rather than each wiring its own
 * `BcryptPasswordHasher` provider.
 */
@Module({
  providers: [{ provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher }],
  exports: [PASSWORD_HASHER],
})
export class SharedModule {}
