import { Inject, Injectable } from '@nestjs/common';
import {
  ICE_CREAM_PURCHASE_REPOSITORY,
  IceCreamPurchaseSortField,
  SortDirection,
} from '../../domain/repositories/ice-cream-purchase.repository';
import type { IceCreamPurchaseRepository } from '../../domain/repositories/ice-cream-purchase.repository';
import {
  IceCreamPurchaseSummaryOutput,
  toIceCreamPurchaseSummaryOutput,
} from '../dtos/ice-cream-purchase-output';

export interface ListIceCreamPurchasesInput {
  /** The requesting user's id/role — a USER only ever sees their own purchases, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  supplierId?: string;
  sortBy?: IceCreamPurchaseSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface ListIceCreamPurchasesOutput {
  items: IceCreamPurchaseSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListIceCreamPurchasesUseCase {
  constructor(
    @Inject(ICE_CREAM_PURCHASE_REPOSITORY)
    private readonly iceCreamPurchaseRepository: IceCreamPurchaseRepository,
  ) {}

  async execute(
    input: ListIceCreamPurchasesInput,
  ): Promise<ListIceCreamPurchasesOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const userId = input.isAdmin ? undefined : input.currentUserId;

    const result = await this.iceCreamPurchaseRepository.findAll({
      userId,
      supplierId: input.supplierId,
      sortBy: input.sortBy ?? 'purchaseDate',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toIceCreamPurchaseSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
