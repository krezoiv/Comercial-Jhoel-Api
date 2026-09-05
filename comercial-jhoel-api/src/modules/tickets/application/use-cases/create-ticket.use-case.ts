import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/repositories/ticket.repository';
import type { TicketRepository } from '../../domain/repositories/ticket.repository';
import { CLIENT_REPOSITORY } from '../../../clients/domain/repositories/client.repository';
import type { ClientRepository } from '../../../clients/domain/repositories/client.repository';
import { TicketEmptyError } from '../../domain/errors/ticket-empty.error';
import { InvalidTicketQuantityError } from '../../domain/errors/invalid-ticket-quantity.error';
import { InvalidTicketPriceError } from '../../domain/errors/invalid-ticket-price.error';
import { InvalidClientError } from '../../domain/errors/invalid-client.error';
import { TicketOutput, toTicketOutput } from '../dtos/ticket-output';

export interface CreateTicketItemInput {
  productId: string;
  quantity: number;
  observation?: string | null;
  /** Optional manual price override for this line — see the DTO's own doc comment for why this never touches the product's real price. */
  unitPrice?: number | null;
}

export interface CreateTicketInput {
  userId: string;
  clientId?: string | null;
  items: CreateTicketItemInput[];
}

/**
 * A Ticket is explicitly NOT a real sale — `create_ticket()` never touches
 * `products.stock`/`inventory_stock`/`inventory_movements`. Structurally
 * mirrors `CreateSaleUseCase`/`CreatePurchaseUseCase`'s own validation and
 * defensive-dedup shape.
 */
@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateTicketInput): Promise<TicketOutput> {
    if (!input.items || input.items.length === 0) {
      throw new TicketEmptyError();
    }

    if (input.clientId) {
      const client = await this.clientRepository.findById(input.clientId);
      if (!client || !client.isActive) {
        throw new InvalidClientError();
      }
    }

    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new InvalidTicketQuantityError(item.productId);
      }
      if (item.unitPrice != null && item.unitPrice < 0) {
        throw new InvalidTicketPriceError(item.productId);
      }
    }

    // Defensive dedup: a manipulated payload could list the same product
    // twice — merge into one line rather than letting create_ticket() insert
    // two ticket_details rows for it. Same reasoning as CreateSaleUseCase.
    // The first non-empty observation/unitPrice seen for a given product
    // wins if the same product appears twice with different values — a real
    // cart never produces this case (the frontend merges into one row per
    // product before it ever reaches here), so this is only a defensive
    // fallback.
    const mergedByProduct = new Map<
      string,
      { quantity: number; observation: string | null; unitPrice: number | null }
    >();
    for (const item of input.items) {
      const existing = mergedByProduct.get(item.productId);
      const observation = item.observation?.trim() || null;
      mergedByProduct.set(item.productId, {
        quantity: (existing?.quantity ?? 0) + item.quantity,
        observation: existing?.observation ?? observation,
        unitPrice: existing?.unitPrice ?? item.unitPrice ?? null,
      });
    }

    const items = [...mergedByProduct.entries()]
      .map(([productId, { quantity, observation, unitPrice }]) => ({
        productId,
        quantity,
        observation,
        unitPrice,
      }))
      .sort((a, b) => a.productId.localeCompare(b.productId));

    const ticket = await this.ticketRepository.createTicket({
      userId: input.userId,
      clientId: input.clientId ?? null,
      items,
    });

    return toTicketOutput(ticket);
  }
}
