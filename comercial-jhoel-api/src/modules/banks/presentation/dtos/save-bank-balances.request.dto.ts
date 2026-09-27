import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class SaveBankBalanceEntryRequestDto {
  @IsUUID()
  bankId: string;

  /** Para la fecha de hoy se ignora: se registra el saldo actual dinámico. Negativo solo lo admite la línea de crédito de Génesis (lo valida `save_bank_balance`). */
  @IsNumber({ maxDecimalPlaces: 2 })
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
