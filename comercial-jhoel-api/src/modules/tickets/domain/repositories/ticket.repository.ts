import { Ticket } from '../entities/ticket.entity';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface CreateTicketItemData {
  productId: string;
  quantity: number;
  observation?: string | null;
  /** Optional manual price override for this line — see `create-ticket.request.dto.ts`'s own doc comment for why this never touches the product's real price. */
  unitPrice?: number | null;
}

export interface CreateTicketData {
  userId: string;
  clientId: string | null;
  /** Free-text client name — see `create-ticket.request.dto.ts`'s own doc comment. Ignored by `create_ticket()` when `clientId` is set, since the real client's name is frozen instead in that case. */
  clientName: string | null;
  items: CreateTicketItemData[];
}

export type TicketStatusFilter = 'ACTIVE' | 'VOIDED';

export interface FindTicketsOptions {
  /** Restricts the listing to one user's own tickets (a USER role never sees anyone else's, same rule as Sales/Purchases). */
  userId?: string;
  /** `startDate`/`endDate` are `yyyy-MM-dd` — compared against `createdAt`, inclusive on both ends. */
  startDate?: string;
  endDate?: string;
  /** Matches against the client's name OR the ticket's own `ticketNumber`, case-insensitive. */
  search?: string;
  status?: TicketStatusFilter;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketRepository {
  /** Invokes the `create_ticket` Postgres function — the ticket and its details are inserted atomically inside it. Never touches inventory. */
  createTicket(data: CreateTicketData): Promise<Ticket>;
  findAll(options: FindTicketsOptions): Promise<PaginatedResult<Ticket>>;
  /** Always includes `items` — unlike `findAll`, which never loads them (list rows use a lighter summary shape). */
  findById(id: string): Promise<Ticket | null>;
  /** Plain conditional `UPDATE` — no stored function needed, same "don't build a procedure where a plain statement is already correct" call as `TypeOrmBankDepositRepository.voidOperation`. The caller (`VoidTicketUseCase`) has already checked the ticket exists and isn't already voided. */
  voidTicket(id: string, voidedBy: string, reason: string): Promise<Ticket>;
}
