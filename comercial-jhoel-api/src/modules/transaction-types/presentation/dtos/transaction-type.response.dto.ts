export class TransactionTypeResponseDto {
  id: string;
  name: string;
  icon: string;
  balanceEffect: string | null;
  cashEffect: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
