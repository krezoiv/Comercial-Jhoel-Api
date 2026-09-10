import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/** Same mandatory-reason shape as every other void request DTO in this codebase (`VoidPurchaseRequestDto`, `VoidRechargePurchaseRequestDto`). */
export class VoidSaleRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Debe indicar un motivo.' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres.' })
  @MaxLength(500)
  reason: string;
}
