import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/repositories/ticket.repository';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketNotFoundError } from '../../domain/errors/ticket-not-found.error';
import { TicketAccessDeniedError } from '../../domain/errors/ticket-access-denied.error';
import { TicketOutput, toTicketOutput } from '../dtos/ticket-output';

export interface GetTicketByIdInput {
  currentUserId: string;
  isAdmin: boolean;
}

@Injectable()
export class GetTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(id: string, input: GetTicketByIdInput): Promise<TicketOutput> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    if (!input.isAdmin && ticket.userId !== input.currentUserId) {
      throw new TicketAccessDeniedError();
    }

    return toTicketOutput(ticket);
  }
}
