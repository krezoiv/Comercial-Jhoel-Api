import { Inject, Injectable } from '@nestjs/common';
import {
  ACCOUNT_RECEIVABLE_REPOSITORY,
  AccountReceivableSortField,
  SortDirection,
} from '../../domain/repositories/account-receivable.repository';
import type { AccountReceivableRepository } from '../../domain/repositories/account-receivable.repository';
import {
  AccountReceivableOutput,
  toAccountReceivableOutput,
} from '../dtos/account-receivable-output';

export interface ListAccountsReceivableInput {
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: AccountReceivableSortField;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
  /** undefined = both active and inactive ("Todos"); true/false = filtered to exactly one state. */
  isActive?: boolean;
}

export interface ListAccountsReceivableOutput {
  items: AccountReceivableOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

@Injectable()
export class ListAccountsReceivableUseCase {
  constructor(
    @Inject(ACCOUNT_RECEIVABLE_REPOSITORY)
    private readonly accountReceivableRepository: AccountReceivableRepository,
  ) {}

  async execute(
    input: ListAccountsReceivableInput = {},
  ): Promise<ListAccountsReceivableOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await this.accountReceivableRepository.findAll({
      isActive: input.isActive,
      clientId: input.clientId,
      dateFrom: input.dateFrom,
      dateTo: input.dateTo,
      minAmount: input.minAmount,
      maxAmount: input.maxAmount,
      search: input.search?.trim() || undefined,
      sortBy: input.sortBy ?? 'date',
      sortDirection: input.sortDirection ?? 'desc',
      page,
      limit,
    });

    return {
      items: result.items.map(toAccountReceivableOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
