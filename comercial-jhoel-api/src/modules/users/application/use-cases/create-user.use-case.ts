import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { PASSWORD_HASHER } from '../../../../shared/application/ports/password-hasher.port';
import type { PasswordHasher } from '../../../../shared/application/ports/password-hasher.port';
import { UsernameAlreadyExistsError } from '../../domain/errors/username-already-exists.error';
import { PhoneAlreadyExistsError } from '../../domain/errors/phone-already-exists.error';

export interface CreateUserInput {
  username: string;
  phone: string;
  password: string;
}

export interface CreateUserOutput {
  id: string;
  username: string;
  phone: string;
  createdAt: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
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

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      username,
      phone,
      passwordHash,
    });

    return {
      id: user.id,
      username: user.username as string,
      phone: user.phone as string,
      createdAt: user.createdAt,
    };
  }
}
