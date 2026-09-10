export class PurchaseItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  sku: string | null;
  quantity: number;
  costPrice: number;
  publicPrice: number;
  total: number;
  presentationName: string;
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
  paymentType: 'CONTADO' | 'CREDITO';
  paymentDueDate: string | null;
  paymentStatus: 'PENDING' | 'PAID';
  paidAt: Date | null;
  paidBy: string | null;
  paidByUsername: string | null;
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
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
  paymentType: 'CONTADO' | 'CREDITO';
  paymentDueDate: string | null;
  paymentStatus: 'PENDING' | 'PAID';
  invoiceNumber: string | null;
  isVoided: boolean;
  voidedAt: Date | null;
  voidedByUsername: string | null;
  voidReason: string | null;
}

export class PaginatedPurchasesResponseDto {
  items: PurchaseSummaryResponseDto[];
  total: number;
  page: number;
  limit: number;
}
