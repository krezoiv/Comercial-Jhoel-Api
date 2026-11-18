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
  clientId: string | null;
  /** Typed-in customer (or the registered client's name for older quotations). */
  clientName: string;
  customerPhone: string | null;
  studentName: string | null;
  grade: string | null;
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
  acceptedAt: Date | null;
  rejectedAt: Date | null;
  rejectReason: string | null;
  soldAt: Date | null;
  soldByUsername: string | null;
  items: QuotationItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class QuotationSummaryResponseDto {
  id: string;
  quotationNumber: string;
  clientId: string | null;
  /** Typed-in customer (or the registered client's name for older quotations). */
  clientName: string;
  customerPhone: string | null;
  studentName: string | null;
  grade: string | null;
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

/** "Confirmar venta" summary: each line with the current Vitrina stock. */
export class QuotationSalePreviewResponseDto {
  quotation: QuotationResponseDto;
  lines: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    available: number;
    isActive: boolean;
    sufficient: boolean;
  }[];
  canConfirm: boolean;
}
