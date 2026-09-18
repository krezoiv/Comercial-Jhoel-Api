/** Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver. */
export class PublicNewsArticleResponseDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  newsTypeName: string;
  hasImage: boolean;
  likesCount: number;
  liked: boolean;
}
