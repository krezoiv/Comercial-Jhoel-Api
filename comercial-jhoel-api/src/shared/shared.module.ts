import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';

@Module({
  providers: [{ provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher }],
  exports: [PASSWORD_HASHER],
})
export class SharedModule {}
