import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UnregisterPushSubscriptionRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  endpoint: string;
}
