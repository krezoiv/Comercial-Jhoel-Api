export class IceCreamResponseDto {
  id: string;
  sku: string;
  product: string;
  costPrice: number;
  publicPrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class PaginatedIceCreamsResponseDto {
  items: IceCreamResponseDto[];
  total: number;
  page: number;
  limit: number;
}
