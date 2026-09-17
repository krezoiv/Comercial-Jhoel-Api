import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateNewsArticleRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  description?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
