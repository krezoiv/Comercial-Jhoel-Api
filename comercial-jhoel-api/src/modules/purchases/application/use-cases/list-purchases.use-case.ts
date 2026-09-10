import { Inject, Injectable } from '@nestjs/common';
import {
  PURCHASE_REPOSITORY,
  PurchaseSortField,
  PurchaseStatusFilter,
  SortDirection,
} from '../../domain/repositories/purchase.repository';
import type { PurchaseRepository } from '../../domain/repositories/purchase.repository';
import {
  PurchaseSummaryOutput,
  toPurchaseSummaryOutput,
} from '../dtos/purchase-output';

export interface ListPurchasesInput {
  /** The requesting user's id/role — a USER only ever sees their own purchases, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: PurchaseStatusFilter;
  sortBy?: PurchaseSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface ListPurchasesOutput {
  items: PurchaseSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListPurchasesUseCase {
  constructor(
    @Inject(PURCHASE_REPOSITORY)
    private readonly purchaseRepository: PurchaseRepository,
  ) {}

  async execute(input: ListPurchasesInput): Promise<ListPurchasesOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const userId = input.isAdmin ? undefined : input.currentUserId;

    const result = await this.purchaseRepository.findAll({
      userId,
      supplierId: input.supplierId,
      startDate: input.startDate,
      endDate: input.endDate,
      search: input.search,
      status: input.status,
      sortBy: input.sortBy ?? 'purchaseDate',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toPurchaseSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
