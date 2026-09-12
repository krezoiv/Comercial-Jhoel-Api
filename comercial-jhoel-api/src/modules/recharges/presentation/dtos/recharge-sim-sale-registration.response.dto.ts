export class RechargeSimSaleRegistrationResponseDto {
  id: string;
  rechargeSimSaleId: string;
  simTypeId: string;
  simTypeName: string;
  simNumber: string;
  sku: string;
  clientDpi: string;
  clientId: string | null;
  clientName: string | null;
  salePrice: number;
  saleDate: string;
  hasDpiImage: boolean;
  isVoided: boolean;
  voidedAt: string | null;
  voidedBy: string | null;
  voidedByUsername: string | null;
  voidReason: string | null;
  createdBy: string;
  createdByUsername: string;
  createdAt: string;
}

export class PaginatedRechargeSimSaleRegistrationsResponseDto {
  items: RechargeSimSaleRegistrationResponseDto[];
  total: number;
  page: number;
  limit: number;
}
