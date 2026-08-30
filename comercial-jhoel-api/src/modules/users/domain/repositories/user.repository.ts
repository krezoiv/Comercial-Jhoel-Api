import { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type UserSortField = 'username' | 'phone' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface FindUsersOptions {
  activeOnly: boolean;
  search?: string;
  roleId?: string;
  sortBy: UserSortField;
  sortDirection: SortDirection;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserData {
  username: string;
  phone: string;
  passwordHash: string;
  roleId: string;
}

export interface UpdateUserData {
  username?: string;
  phone?: string;
  passwordHash?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface UserRepository {
  findAll(options: FindUsersOptions): Promise<PaginatedResult<User>>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByUsernameOrPhone(identifier: string): Promise<User | null>;
  updatePasswordHash(id: string, passwordHash: string): Promise<void>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  deactivate(id: string): Promise<void>;
}
