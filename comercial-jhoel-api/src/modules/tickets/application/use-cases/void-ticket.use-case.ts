import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/repositories/ticket.repository';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import { TicketNotFoundError } from '../../domain/errors/ticket-not-found.error';
import { TicketAlreadyVoidedError } from '../../domain/errors/ticket-already-voided.error';
import { TicketOutput, toTicketOutput } from '../dtos/ticket-output';

export interface VoidTicketInput {
  id: string;
  voidedBy: string;
  reason: string;
}

/**
 * The correction path for a mistaken Ticket — never an edit, never a
 * physical delete. Same shape as `VoidBankDepositOperationUseCase`.
 * Admin-only (enforced at the controller via `@Roles`).
 */
@Injectable()
export class VoidTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(input: VoidTicketInput): Promise<TicketOutput> {
    const ticket = await this.ticketRepository.findById(input.id);
    if (!ticket) {
      throw new TicketNotFoundError(input.id);
    }
    if (ticket.isVoided) {
      throw new TicketAlreadyVoidedError(input.id);
    }

    const voided = await this.ticketRepository.voidTicket(
      input.id,
      input.voidedBy,
      input.reason,
    );
    return toTicketOutput(voided);
  }
}
