import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class UpdateSubscriptionPreferencesRequestDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Selecciona al menos un tipo de noticias que deseas recibir.' })
  @IsUUID('4', { each: true })
  typeIds: string[];
}
