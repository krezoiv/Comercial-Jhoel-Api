import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users/domain/repositories/user.repository';
import type { UserRepository } from '../../../users/domain/repositories/user.repository';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { TOKEN_SERVICE } from '../ports/token-service.port';
import type { TokenService } from '../ports/token-service.port';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  user: {
    id: string;
    username: string;
    phone: string;
    role: string;
  };
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const identifier = input.identifier.trim();
    const user = await this.userRepository.findByUsernameOrPhone(identifier);
    if (!user) {
      // Same generic error as an invalid password: don't let a caller tell
      // "unknown user" apart from "wrong password" (user enumeration).
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      // Same generic error as "unknown user"/"wrong password" — don't reveal
      // that the account exists but was deactivated.
      throw new InvalidCredentialsError();
    }

    const username = user.username ?? '';
    const accessToken = this.tokenService.sign({
      sub: user.id,
      username,
      role: user.roleName,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        username,
        phone: user.phone ?? '',
        role: user.roleName,
      },
    };
  }
}
