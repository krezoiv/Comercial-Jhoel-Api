import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY,
  TicketStatusFilter,
} from '../../domain/repositories/ticket.repository';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import {
  TicketSummaryOutput,
  toTicketSummaryOutput,
} from '../dtos/ticket-output';

export interface ListTicketsInput {
  /** The requesting user's id/role — a USER only ever sees their own tickets, regardless of what's asked. */
  currentUserId: string;
  isAdmin: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  status?: TicketStatusFilter;
  page?: number;
  limit?: number;
}

export interface ListTicketsOutput {
  items: TicketSummaryOutput[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ListTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(input: ListTicketsInput): Promise<ListTicketsOutput> {
    const page = input.page && input.page > 0 ? input.page : DEFAULT_PAGE;
    const limit =
      input.limit && input.limit > 0
        ? Math.min(input.limit, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const userId = input.isAdmin ? undefined : input.currentUserId;

    const result = await this.ticketRepository.findAll({
      userId,
      startDate: input.startDate,
      endDate: input.endDate,
      search: input.search,
      status: input.status,
      page,
      limit,
    });

    return {
      items: result.items.map(toTicketSummaryOutput),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }
}
