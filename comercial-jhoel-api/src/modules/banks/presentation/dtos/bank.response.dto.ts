export class BankResponseDto {
  id: string;
  name: string;
  accountNumber: string;
  accountTypeId: string;
  accountTypeName: string;
  previousBalance: number;
  finalBalance: number;
  specialAccount: string | null;
  maxBalance: number | null;
  availableInTransaccionar: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
