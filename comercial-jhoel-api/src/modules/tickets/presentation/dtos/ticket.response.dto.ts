export class TicketItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  observation: string | null;
}

export class TicketResponseDto {
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
  items: TicketItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class TicketSummaryResponseDto {
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

export class PaginatedTicketsResponseDto {
  items: TicketSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
