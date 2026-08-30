export class ProductResponseDto {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedProductsResponseDto {
  items: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
}
