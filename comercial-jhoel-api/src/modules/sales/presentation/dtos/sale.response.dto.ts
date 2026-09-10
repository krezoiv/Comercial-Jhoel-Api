export class SaleItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  presentationName: string;
}

export class SaleResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  status: 'OPEN' | 'CONFIRMED';
  clientId: string | null;
  clientName: string | null;
  priceList: 'PUBLIC' | 'WHOLESALE';
  draftKey: string | null;
  items: SaleItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export class SaleSummaryResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  clientId: string | null;
  clientName: string | null;
  priceList: 'PUBLIC' | 'WHOLESALE';
  createdAt: Date;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export class PaginatedSalesResponseDto {
  items: SaleSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
