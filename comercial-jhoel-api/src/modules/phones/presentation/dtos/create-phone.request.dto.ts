import {
  IsDateString,
  IsIn,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { PhoneOperator } from '../../domain/entities/phone.entity';

export class CreatePhoneRequestDto {
  @IsIn(['CLARO', 'TIGO'])
  operator: PhoneOperator;

  @IsString()
  @MinLength(1, { message: 'El número de teléfono es obligatorio.' })
  phoneNumber: string;

  @IsString()
  @MinLength(1, { message: 'El IMEI es obligatorio.' })
  imei: string;

  @IsNumber()
  @Min(0)
  costPrice: number;

  @IsNumber()
  @Min(0)
  publicPrice: number;

  @IsDateString()
  purchaseDate: string;
}
