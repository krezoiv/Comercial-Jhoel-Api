import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TRANSACTION_TYPE_ICONS } from '../../domain/entities/transaction-type.entity';

export class UpdateTransactionTypeRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsIn(TRANSACTION_TYPE_ICONS)
  icon?: string;
}
