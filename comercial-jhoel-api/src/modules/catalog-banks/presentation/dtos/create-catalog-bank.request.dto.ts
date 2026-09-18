import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCatalogBankRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
