import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterSalesCashBoxMovementRequestDto {
  @IsUUID()
  businessId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un concepto u observación.' })
  @MinLength(3, { message: 'El concepto debe tener al menos 3 caracteres.' })
  @MaxLength(255)
  concept: string;
}
