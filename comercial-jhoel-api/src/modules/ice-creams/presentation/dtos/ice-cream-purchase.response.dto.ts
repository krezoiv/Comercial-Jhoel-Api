export class IceCreamPurchaseItemResponseDto {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export class IceCreamPurchaseResponseDto {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  items: IceCreamPurchaseItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class IceCreamPurchaseSummaryResponseDto {
  id: string;
  supplierId: string;
  supplierName: string;
  userId: string;
  username: string;
  purchaseDate: Date;
  total: number;
  createdAt: Date;
}

export class PaginatedIceCreamPurchasesResponseDto {
  items: IceCreamPurchaseSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
