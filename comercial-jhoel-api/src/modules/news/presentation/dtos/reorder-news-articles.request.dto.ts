import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsInt, IsUUID, ValidateNested } from 'class-validator';

export class ReorderNewsArticleItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  sortOrder: number;
}

export class ReorderNewsArticlesRequestDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => ReorderNewsArticleItemDto)
  items: ReorderNewsArticleItemDto[];
}
