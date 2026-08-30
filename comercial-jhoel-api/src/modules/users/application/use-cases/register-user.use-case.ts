import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { ROLE_REPOSITORY } from '../../../roles/domain/repositories/role.repository';
import type { RoleRepository } from '../../../roles/domain/repositories/role.repository';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';

export interface RegisterUserInput {
  username: string;
  phone: string;
  password: string;
}

export interface RegisterUserOutput {
  id: string;
  username: string;
  phone: string;
  role: string;
  createdAt: Date;
}

/** Public self-registration always creates the least-privileged role — never let a public signup grant ADMIN. */
const DEFAULT_SELF_SIGNUP_ROLE = 'USER' as const;

/**
 * Backs the public `POST /users/register` endpoint — distinct from the
 * admin-only `POST /users` (`CreateUserUseCase`), which lets an ADMIN/
 * SUPER_ADMIN assign any active role. Never let this use case accept a
 * caller-supplied role.
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: RoleRepository,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const username = input.username.trim();
    const phone = input.phone.trim();

    const existingByUsername =
      await this.userRepository.findByUsername(username);
    if (existingByUsername) {
      throw new UsernameAlreadyExistsError(username);
    }

    const existingByPhone = await this.userRepository.findByPhone(phone);
    if (existingByPhone) {
      throw new PhoneAlreadyExistsError(phone);
    }

    const role = await this.roleRepository.findByName(DEFAULT_SELF_SIGNUP_ROLE);
    if (!role) {
      // Seeded by migration — only reachable if the DB was tampered with.
      throw new InternalServerErrorException(
        'El rol por defecto no está configurado.',
      );
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      username,
      phone,
      passwordHash,
      roleId: role.id,
    });

    return {
      id: user.id,
      username: user.username as string,
      phone: user.phone as string,
      role: user.roleName,
      createdAt: user.createdAt,
    };
  }
}
