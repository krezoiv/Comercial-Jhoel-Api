import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCatalogProductRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  catalogDescription?: string | null;
}
