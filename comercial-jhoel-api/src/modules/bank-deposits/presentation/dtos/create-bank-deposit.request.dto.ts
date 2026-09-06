import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class BankDepositCashDetailRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  denomination: number;

  @IsInt()
  @Min(0)
  quantity: number;
}

export class CreateBankDepositRequestDto {
  @IsUUID()
  transactionBankId: string;

  @IsUUID()
  transactionTypeId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  totalAmount: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Debe incluir el desglose de efectivo.',
  })
  @ValidateNested({ each: true })
  @Type(() => BankDepositCashDetailRequestDto)
  cashDetails: BankDepositCashDetailRequestDto[];

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Debe incluir al menos una transacción.',
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { each: true })
  @Min(0.01, { each: true })
  transactionAmounts: number[];

  /** Free-text — never looked up against the `clients` table, see the domain entity's own doc comment. */
  @IsOptional()
  @IsString()
  @MaxLength(150)
  clientName?: string;

  /** "Vuelto" — omitido/`0` significa que no hubo vuelto, idéntico al comportamiento de siempre. El backend recalcula/valida esto contra el efectivo real, nunca confía ciegamente en este valor. */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  changeGiven?: number;
}
