import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

/** bcrypt's own recommended default as of this writing — high enough to resist offline brute-forcing, low enough not to make login noticeably slow. */
const SALT_ROUNDS = 10;

/** The concrete `PasswordHasher` bound in `SharedModule` — see that port's own doc comment for why nothing outside this file imports `bcrypt` directly. */
@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
