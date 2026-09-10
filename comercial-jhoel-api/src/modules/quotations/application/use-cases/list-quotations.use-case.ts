import { Inject, Injectable } from '@nestjs/common';
import { QUOTATION_REPOSITORY } from '../../domain/repositories/quotation.repository';
import type {
  QuotationRepository,
  QuotationStatusFilter,
} from '../../domain/repositories/quotation.repository';
import {
  QuotationSummaryOutput,
  toQuotationSummaryOutput,
} from '../dtos/quotation-output';

export interface ListQuotationsInput {
  /** The requesting user's id/role — a USER only ever sees their own quotations, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  status?: QuotationStatusFilter;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListQuotationsOutput {
  items: QuotationSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListQuotationsUseCase {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: QuotationRepository,
  ) {}

  async execute(input: ListQuotationsInput): Promise<ListQuotationsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const userId = input.isAdmin ? undefined : input.currentUserId;

    const result = await this.quotationRepository.findAll({
      userId,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      search: input.search,
      page,
      limit,
    });

    return {
      items: result.items.map(toQuotationSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
