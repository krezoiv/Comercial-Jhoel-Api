export class CatalogBankResponseDto {
  id: string;
  name: string;
  description: string | null;
  additionalInfo: string | null;
  isActive: boolean;
  sortOrder: number;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
