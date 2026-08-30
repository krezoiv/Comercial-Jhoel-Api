export class PurchaseItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  total: number;
}

export class PurchaseResponseDto {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: PurchaseItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class PurchaseSummaryResponseDto {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  createdAt: Date;
}

export class PaginatedPurchasesResponseDto {
  items: PurchaseSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
