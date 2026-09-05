import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class RegisterTransferRequestDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  presentationId?: string;

  @IsUUID()
  fromLocationId: string;

  @IsUUID()
  toLocationId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
