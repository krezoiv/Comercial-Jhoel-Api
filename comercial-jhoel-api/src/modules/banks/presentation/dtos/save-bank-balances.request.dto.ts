import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class SaveBankBalanceEntryRequestDto {
  @IsUUID()
  bankId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  finalBalance: number;
}

export class SaveBankBalancesRequestDto {
  /** The operation date the user picked — the backend stores exactly this, never re-derives "today" from the request time (see the migration's own doc comment on why `operation_date` is a plain DATE). */
  @IsDateString()
  operationDate: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Debes ingresar al menos un saldo final para guardar.',
  })
  @ValidateNested({ each: true })
  @Type(() => SaveBankBalanceEntryRequestDto)
  entries: SaveBankBalanceEntryRequestDto[];
}
