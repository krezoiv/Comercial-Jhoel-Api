import { Ticket } from '../../domain/entities/ticket.entity';

export interface TicketItemOutput {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  observation: string | null;
}

/** Full shape — used for `GET /tickets/:id`, the response of `POST /tickets`, and `POST /tickets/:id/void`. */
export interface TicketOutput {
  id: string;
  ticketNumber: string;
  clientId: string | null;
  clientName: string | null;
  userId: string;
  username: string;
  subtotal: number;
  discount: number;
  total: number;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  items: TicketItemOutput[];
  createdAt: Date;
  updatedAt: Date;
}

/** Lighter shape for `GET /tickets` — no line items, so listing tickets never needs to load them. */
export interface TicketSummaryOutput {
  id: string;
  ticketNumber: string;
  clientId: string | null;
  clientName: string | null;
  userId: string;
  username: string;
  total: number;
  isVoided: boolean;
  createdAt: Date;
}

export function toTicketOutput(ticket: Ticket): TicketOutput {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    clientId: ticket.clientId,
    clientName: ticket.clientName,
    userId: ticket.userId,
    username: ticket.username,
    subtotal: ticket.subtotal,
    discount: ticket.discount,
    total: ticket.total,
    isVoided: ticket.isVoided,
    voidedAt: ticket.voidedAt,
    voidedBy: ticket.voidedBy,
    voidedByUsername: ticket.voidedByUsername,
    voidReason: ticket.voidReason,
    items: ticket.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      presentationName: item.presentationName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.total,
      observation: item.observation,
    })),
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

export function toTicketSummaryOutput(ticket: Ticket): TicketSummaryOutput {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    clientId: ticket.clientId,
    clientName: ticket.clientName,
    userId: ticket.userId,
    username: ticket.username,
    total: ticket.total,
    isVoided: ticket.isVoided,
    createdAt: ticket.createdAt,
  };
}
