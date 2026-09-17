export class NewsArticleResponseDto {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
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
