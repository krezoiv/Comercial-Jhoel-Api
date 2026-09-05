import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTransactionBankRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  name: string;
}
