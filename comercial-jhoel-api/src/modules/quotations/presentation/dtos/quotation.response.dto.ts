import { QuotationDisplayStatus } from '../../application/dtos/quotation-output';

export class QuotationItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  presentationName: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
}

export class QuotationResponseDto {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  userId: string;
  username: string;
  quotationDate: Date;
  expirationDate: string;
  subtotal: number;
  discount: number;
  total: number;
  observations: string | null;
  commercialTerms: string | null;
  status: QuotationDisplayStatus;
  voidedAt: Date | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  convertedToSaleId: string | null;
  items: QuotationItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class QuotationSummaryResponseDto {
  id: string;
  quotationNumber: string;
  clientId: string;
  clientName: string;
  userId: string;
  username: string;
  expirationDate: string;
  total: number;
  status: QuotationDisplayStatus;
  createdAt: Date;
}

export class PaginatedQuotationsResponseDto {
  items: QuotationSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
