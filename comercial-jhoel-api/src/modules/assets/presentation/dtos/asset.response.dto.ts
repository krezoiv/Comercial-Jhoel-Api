export class AssetResponseDto {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  amount: number;
  movementType: 'CARGO' | 'ABONO';
  description: string | null;
  paymentMethod: 'EFECTIVO' | 'BANCO' | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class PaginatedAssetsResponseDto {
  items: AssetResponseDto[];
  total: number;
  page: number;
  limit: number;
}
