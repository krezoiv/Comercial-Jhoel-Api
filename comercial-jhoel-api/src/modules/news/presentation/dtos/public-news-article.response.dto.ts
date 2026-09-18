/** Backs Noticias en la landing — sin isActive/audit, solo lo que un visitante puede ver. */
export class PublicNewsArticleResponseDto {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  hasImage: boolean;
  likesCount: number;
}
