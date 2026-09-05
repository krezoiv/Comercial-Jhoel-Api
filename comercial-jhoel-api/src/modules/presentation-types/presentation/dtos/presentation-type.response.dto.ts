export class PresentationTypeResponseDto {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class PresentationTypeListResponseDto extends PresentationTypeResponseDto {
  usageCount: number;
}
