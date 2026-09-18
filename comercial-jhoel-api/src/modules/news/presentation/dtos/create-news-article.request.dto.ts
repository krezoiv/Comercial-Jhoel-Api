import { IsDateString, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

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

  @IsUUID('4', { message: 'El tipo de noticia es obligatorio.' })
  newsTypeId: string;
}
