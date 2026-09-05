export class StockByLocationResponseDto {
  locationId: string;
  locationName: string;
  quantity: number;
}

export class ProductResponseDto {
  id: string;
  name: string;
  sku: string | null;
  categoryId: string;
  categoryName: string;
  businessId: string;
  businessName: string;
  unitOfMeasureId: string;
  unitOfMeasureName: string;
  unitOfMeasureAbbreviation: string;
  costPrice: number;
  publicPrice: number;
  wholesalePrice: number;
  stock: number;
  stockByLocation?: StockByLocationResponseDto[];
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
