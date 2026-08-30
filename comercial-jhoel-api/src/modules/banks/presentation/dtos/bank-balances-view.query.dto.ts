import { IsDateString } from 'class-validator';

export class BankBalancesViewQueryDto {
  @IsDateString()
  operationDate: string;
}
