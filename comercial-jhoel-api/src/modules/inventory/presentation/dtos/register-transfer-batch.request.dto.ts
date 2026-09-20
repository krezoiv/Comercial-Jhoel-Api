import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class RegisterTransferBatchItemDto {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsUUID()
  presentationId?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class RegisterTransferBatchRequestDto {
  @IsUUID()
  fromLocationId: string;

  @IsUUID()
  toLocationId: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RegisterTransferBatchItemDto)
  items: RegisterTransferBatchItemDto[];
}
