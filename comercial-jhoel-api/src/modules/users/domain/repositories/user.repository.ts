import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface CreateUserData {
  username: string;
  phone: string;
  passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByUsernameOrPhone(identifier: string): Promise<User | null>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  create(data: CreateUserData): Promise<User>;
}
