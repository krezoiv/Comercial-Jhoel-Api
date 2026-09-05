export class UnitOfMeasureResponseDto {
  id: string;
  name: string;
  abbreviation: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class UnitOfMeasureListResponseDto extends UnitOfMeasureResponseDto {
  usageCount: number;
}
