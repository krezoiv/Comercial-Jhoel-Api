import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserSortField,
  SortDirection,
} from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserOutput, toUserOutput } from '../dtos/user-output';

export interface ListUsersInput {
  search?: string;
  roleId?: string;
  sortBy?: UserSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface ListUsersOutput {
  items: UserOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async execute(input: ListUsersInput = {}): Promise<ListUsersOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.userRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
      roleId: input.roleId,
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toUserOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
