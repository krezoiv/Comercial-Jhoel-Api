export class NewsArticleResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeId: string;
  newsTypeName: string;
  isActive: boolean;
  sortOrder: number;
  likesCount: number;
  hasImage: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUsername: string;
  updatedBy: string | null;
  updatedByUsername: string | null;
}
