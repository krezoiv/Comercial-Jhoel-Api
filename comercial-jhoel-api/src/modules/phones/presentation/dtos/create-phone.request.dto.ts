import {
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import type { PhoneOperator } from '../../domain/entities/phone.entity';

/** No `phoneNumber` here — a bought phone has no active line yet, see `phone.entity.ts`'s own doc comment. It's assigned later, at the moment of sale (`RegisterPhoneSaleRequestDto`). */
export class CreatePhoneRequestDto {
  @IsIn(['CLARO', 'TIGO'])
  operator: PhoneOperator;

  @IsString()
  @MinLength(1, { message: 'El modelo es obligatorio.' })
  @MaxLength(150)
  model: string;

  @IsString()
  @MinLength(1, { message: 'El IMEI es obligatorio.' })
  imei: string;

  @IsString()
  @MinLength(1, { message: 'El número de SIM es obligatorio.' })
  @MaxLength(30)
  simNumber: string;

  @IsNumber()
  @Min(0)
  costPrice: number;

  @IsNumber()
  @Min(0)
  publicPrice: number;

  @IsDateString()
  purchaseDate: string;
}
