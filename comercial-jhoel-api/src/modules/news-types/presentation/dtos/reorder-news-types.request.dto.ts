import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsInt, IsUUID, ValidateNested } from 'class-validator';

export class ReorderNewsTypeItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  sortOrder: number;
}

export class ReorderNewsTypesRequestDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ReorderNewsTypeItemDto)
  items: ReorderNewsTypeItemDto[];
}
