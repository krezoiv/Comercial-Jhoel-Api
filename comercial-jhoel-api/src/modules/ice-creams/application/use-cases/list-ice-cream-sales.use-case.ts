import { Inject, Injectable } from '@nestjs/common';
import {
  ICE_CREAM_SALE_REPOSITORY,
  IceCreamSaleSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream-sale.repository';
import type { IceCreamSaleRepository } from '../../domain/repositories/ice-cream-sale.repository';
import {
  IceCreamSaleSummaryOutput,
  toIceCreamSaleSummaryOutput,
} from '../dtos/ice-cream-sale-output';

export interface ListIceCreamSalesInput {
  /** The requesting user's id/role — a USER only ever sees their own sales, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  sortBy?: IceCreamSaleSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface ListIceCreamSalesOutput {
  items: IceCreamSaleSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListIceCreamSalesUseCase {
  constructor(
    @Inject(ICE_CREAM_SALE_REPOSITORY)
    private readonly iceCreamSaleRepository: IceCreamSaleRepository,
  ) {}

  async execute(
    input: ListIceCreamSalesInput,
  ): Promise<ListIceCreamSalesOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const userId = input.isAdmin ? undefined : input.currentUserId;

    const result = await this.iceCreamSaleRepository.findAll({
      userId,
      sortBy: input.sortBy ?? 'saleDate',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toIceCreamSaleSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
