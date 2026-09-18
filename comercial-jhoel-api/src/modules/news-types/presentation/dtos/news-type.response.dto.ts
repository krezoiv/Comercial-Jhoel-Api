export class NewsTypeResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isWildcard: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}

export class NewsTypeListResponseDto extends NewsTypeResponseDto {
  usageCount: number;
}

/** Shape público — backs el formulario de suscripción, sin auditoría. */
export class PublicNewsTypeResponseDto {
  id: string;
  name: string;
  slug: string;
  isWildcard: boolean;
}
