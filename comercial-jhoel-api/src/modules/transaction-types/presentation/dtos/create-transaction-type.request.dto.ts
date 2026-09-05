import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TRANSACTION_TYPE_ICONS } from '../../domain/entities/transaction-type.entity';

export class CreateTransactionTypeRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsIn(TRANSACTION_TYPE_ICONS)
  icon: string;
}
