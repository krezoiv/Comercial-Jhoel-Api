import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNewsArticleRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  description: string;

  @IsDateString()
  publishedAt: string;
}
