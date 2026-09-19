import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PushSubscriptionKeysDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  auth: string;
}

export class RegisterPushSubscriptionRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  endpoint: string;

  @ValidateNested()
  @Type(() => PushSubscriptionKeysDto)
  keys: PushSubscriptionKeysDto;

  @IsArray()
  @ArrayMinSize(1, { message: 'Selecciona al menos un tipo de noticias que deseas recibir.' })
  @IsUUID('4', { each: true })
  typeIds: string[];

  /** `manageToken` de una suscripción existente en este mismo navegador, si la hay — ver el doc comment de `RegisterPushSubscriptionUseCase`. */
  @IsOptional()
  @IsUUID('4')
  existingManageToken?: string;
}
