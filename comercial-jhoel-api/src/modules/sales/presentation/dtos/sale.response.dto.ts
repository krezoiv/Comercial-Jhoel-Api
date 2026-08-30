export class SaleItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class SaleResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  status: 'OPEN' | 'CONFIRMED';
  items: SaleItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class SaleSummaryResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  createdAt: Date;
}

export class PaginatedSalesResponseDto {
  items: SaleSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
