import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsInt, IsUUID, ValidateNested } from 'class-validator';

export class ReorderCatalogBankItemDto {
  @IsUUID()
  id: string;

  @IsInt()
  sortOrder: number;
}

export class ReorderCatalogBanksRequestDto {
  @ArrayMinSize(1)
  @ArrayMaxSize(200)
  @ValidateNested({ each: true })
  @Type(() => ReorderCatalogBankItemDto)
  items: ReorderCatalogBankItemDto[];
}
