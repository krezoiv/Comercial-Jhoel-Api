export class IceCreamSaleItemResponseDto {
  id: string;
  iceCreamId: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class IceCreamSaleResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  items: IceCreamSaleItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}

export class IceCreamSaleSummaryResponseDto {
  id: string;
  userId: string;
  username: string;
  saleDate: Date;
  total: number;
  createdAt: Date;
}

export class PaginatedIceCreamSalesResponseDto {
  items: IceCreamSaleSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
