import { TicketDetail } from './ticket-detail.entity';

export interface TicketProps {
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
  items: TicketDetail[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * A Ticket is explicitly NOT a real sale — created in one shot (like a
 * Purchase), never touches `products.stock`/`inventory_stock`/
 * `inventory_movements` (see `create_ticket()`), never appears in Sales
 * reports/dashboard. Correction is anular-and-recreate, never a silent edit.
 */
export class Ticket {
  private constructor(private readonly props: TicketProps) {}

  static create(props: TicketProps): Ticket {
    return new Ticket(props);
  }

  get id(): string {
    return this.props.id;
  }

  get ticketNumber(): string {
    return this.props.ticketNumber;
  }

  get clientId(): string | null {
    return this.props.clientId;
  }

  get clientName(): string | null {
    return this.props.clientName;
  }

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get subtotal(): number {
    return this.props.subtotal;
  }

  get discount(): number {
    return this.props.discount;
  }

  get total(): number {
    return this.props.total;
  }

  get isVoided(): boolean {
    return this.props.isVoided;
  }

  get voidedAt(): Date | null {
    return this.props.voidedAt;
  }

  get voidedBy(): string | null {
    return this.props.voidedBy;
  }

  get voidedByUsername(): string | null {
    return this.props.voidedByUsername;
  }

  get voidReason(): string | null {
    return this.props.voidReason;
  }

  get items(): TicketDetail[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
