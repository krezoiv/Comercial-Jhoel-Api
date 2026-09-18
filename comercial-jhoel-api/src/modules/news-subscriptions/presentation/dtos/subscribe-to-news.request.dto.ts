import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class SubscribeToNewsRequestDto {
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'Ingresa un número de WhatsApp válido.' })
  whatsappNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Selecciona al menos un tipo de noticias que deseas recibir.' })
  @IsUUID('4', { each: true })
  typeIds: string[];

  @IsBoolean()
  consent: boolean;
}
