import { Inject, Injectable } from '@nestjs/common';
import {
  SALE_REPOSITORY,
  SaleSortField,
  SaleStatusFilter,
  SortDirection,
} from '../../domain/repositories/sale.repository';
import type { SaleRepository } from '../../domain/repositories/sale.repository';
import { SaleSummaryOutput, toSaleSummaryOutput } from '../dtos/sale-output';

export interface ListSalesInput {
  /** The requesting user's id/role — a USER only ever sees their own sales, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  /** ADMIN/SUPER_ADMIN only — filters to one specific user's sales. Ignored for a non-admin caller. */
  userId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: SaleStatusFilter;
  sortBy?: SaleSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface ListSalesOutput {
  items: SaleSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListSalesUseCase {
  constructor(
    @Inject(SALE_REPOSITORY) private readonly saleRepository: SaleRepository,
  ) {}

  async execute(input: ListSalesInput): Promise<ListSalesOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    // A USER role can never widen the listing to another account's sales —
    // the backend decides the effective filter, the query param is only
    // meaningful for an admin.
    const userId = input.isAdmin ? input.userId : input.currentUserId;

    const result = await this.saleRepository.findAll({
      userId,
      clientId: input.clientId,
      startDate: input.startDate,
      endDate: input.endDate,
      search: input.search,
      status: input.status,
      sortBy: input.sortBy ?? 'saleDate',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toSaleSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
