import { Inject, Injectable } from '@nestjs/common';
import {
  ICE_CREAM_REPOSITORY,
  IceCreamSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream.repository';
import type { IceCreamRepository } from '../../domain/repositories/ice-cream.repository';
import { IceCreamOutput, toIceCreamOutput } from '../dtos/ice-cream-output';

export interface ListIceCreamsInput {
  search?: string;
  sortBy?: IceCreamSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

export interface ListIceCreamsOutput {
  items: IceCreamOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

@Injectable()
export class ListIceCreamsUseCase {
  constructor(
    @Inject(ICE_CREAM_REPOSITORY)
    private readonly iceCreamRepository: IceCreamRepository,
  ) {}

  async execute(input: ListIceCreamsInput = {}): Promise<ListIceCreamsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.iceCreamRepository.findAll({
      activeOnly: !input.includeInactive,
      search: input.search?.trim() || undefined,
      sortBy: input.sortBy ?? 'createdAt',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toIceCreamOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
