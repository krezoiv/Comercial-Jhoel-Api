import { IsInt, Min } from 'class-validator';

export class SetMinStockRequestDto {
  @IsInt()
  @Min(0)
  minStock: number;
}
